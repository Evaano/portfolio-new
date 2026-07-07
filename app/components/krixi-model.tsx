'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// The master bone of the model's 3ds Max Biped rig. Every bundled clip
// translates this bone through the scene (that's the "walking away"), so we pin
// it to its rest position each frame — the body still animates fully, in place.
const ROOT_BONE = 'Bip001_163';

export default function KrixiModel({ height = '400px' }: { height?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Guards the async GLTF callback against React StrictMode's mount → unmount
    // → remount cycle, so a torn-down instance can't touch a live one.
    let disposed = false;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0.5, 2.4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.mapSize.set(2048, 2048);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.8);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffe6f5, 0.6);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);
    const topLight = new THREE.PointLight(0xffffff, 0.5);
    topLight.position.set(0, 5, 0);
    scene.add(topLight);

    // Pivot wraps the model so the cursor look-at / hover-scale transforms stay
    // independent of the skeletal animation playing on the model itself.
    const pivot = new THREE.Group();
    scene.add(pivot);

    const clock = new THREE.Clock();
    let mixer: THREE.AnimationMixer | null = null;
    let current: THREE.AnimationAction | null = null;
    let rootBone: THREE.Object3D | null = null;
    const rootRest = new THREE.Vector3();
    const actions: Record<string, THREE.AnimationAction> = {};

    // interaction state (mutated by listeners, read in the render loop)
    const pointer = { x: 0 }; // normalized -1..1 horizontal target
    const smooth = { x: 0 }; // eased pointer
    let hovered = false;
    let targetScale = 1;
    let scaleNow = 1;
    let spin = 0; // remaining click-spin radians

    // crossfade to another clip
    const play = (name: string, { once = false } = {}) => {
      const action = actions[name];
      if (!action || action === current) return;
      action.reset();
      action.enabled = true;
      action.setEffectiveWeight(1);
      action.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, once ? 1 : Infinity);
      action.clampWhenFinished = once;
      action.fadeIn(0.3).play();
      if (current) current.fadeOut(0.3);
      current = action;
    };

    const loader = new GLTFLoader();
    loader.load(
      '/krixi_valentine_aov/scene.gltf',
      gltf => {
        if (disposed) return;
        gltf.scene.position.set(0, -1.7, 0);
        pivot.add(gltf.scene);
        setIsLoading(false);

        // Pin the biped master bone so the clips play in place (no root motion).
        rootBone = gltf.scene.getObjectByName(ROOT_BONE) ?? null;
        if (rootBone) rootRest.copy(rootBone.position);

        if (!reduceMotion && gltf.animations?.length) {
          mixer = new THREE.AnimationMixer(gltf.scene);
          gltf.animations.forEach(clip => {
            actions[clip.name] = mixer!.clipAction(clip);
          });
          // "Come" is the spawn/greeting — play it once as the loading-in, then
          // settle into the calm "Standby" idle loop.
          play('Come', { once: true });
          mixer.addEventListener('finished', e => {
            if (e.action === current) play(hovered ? 'Idleshow' : 'Standby');
          });
        }

        // Paint at least one frame right away. requestAnimationFrame is paused
        // while the tab is backgrounded, so without this the model stays blank
        // if it finishes loading while the tab is out of focus.
        renderer.render(scene, camera);
      },
      undefined,
      error => {
        if (disposed) return;
        console.error('[KrixiModel] Error loading model:', error);
        setIsLoading(false);
      }
    );

    // ---- interaction listeners ----
    // Track the pointer globally and derive hover from geometry, so the model
    // faces front the instant the cursor isn't over its own tile.
    const onWindowMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      // roam freely: follow the cursor anywhere on the page (relative to the
      // tile centre), so the model looks around and eases smoothly back toward
      // centre as the cursor returns — no hard snap-to-centre.
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.x = Math.max(-1.2, Math.min(1.2, nx));

      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (inside && !hovered) {
        hovered = true;
        targetScale = 1.05;
        if (current !== actions.Come) play('Idleshow');
      } else if (!inside && hovered) {
        hovered = false;
        targetScale = 1;
        if (current !== actions.Come) play('Standby');
      }
    };
    const onClick = () => {
      spin += Math.PI * 2; // one full playful spin (in place, about Y)
    };

    if (!reduceMotion) {
      window.addEventListener('pointermove', onWindowMove);
      container.addEventListener('click', onClick);
      container.style.cursor = 'pointer';
    }

    // ---- render loop ----
    let raf = 0;
    const animate = () => {
      if (disposed) return;
      raf = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const t = clock.elapsedTime;

      if (mixer) {
        mixer.update(delta);
        // Pin the root during the looping idles so they stay in place, but let
        // the one-shot "Come" entrance keep its motion so she moves in on load.
        if (rootBone && current !== actions.Come) rootBone.position.copy(rootRest);
      }

      if (!reduceMotion) {
        // look-around: continuously follow the cursor's position, easing
        // toward it (and back to centre as it returns) — free roam, no snap.
        // Wide range so the turn clearly reads over the busy idle animation.
        smooth.x += (pointer.x - smooth.x) * 0.08;

        // consume click spin
        spin -= spin * 0.12;
        if (spin < 0.001) spin = 0;

        pivot.rotation.y = smooth.x * 0.5 + (Math.PI * 2 - spin);
        pivot.position.y = Math.sin(t * 1.2) * 0.03; // gentle extra float

        scaleNow += (targetScale - scaleNow) * 0.1;
        pivot.scale.setScalar(scaleNow);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Repaint when the tab becomes visible / regains focus — rAF is throttled to
    // a stop while hidden, so force a fresh frame and drop the accumulated time
    // gap so the animation doesn't fast-forward.
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        clock.getDelta();
        renderer.render(scene, camera);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onWindowMove);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
      container.removeEventListener('click', onClick);
      mixer?.stopAllAction();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height,
        minHeight: '320px',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
          }}
        >
          Loading model...
        </div>
      )}
    </div>
  );
}
