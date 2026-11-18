import { Component, Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { AnimationMixer, Box3, BufferAttribute, BufferGeometry, LoopOnce, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin } from '@pixiv/three-vrm';
import { VRMAnimationLoaderPlugin, createVRMAnimationClip } from '@pixiv/three-vrm-animation';

class StageErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

const overviewGestures = ['think', 'idle-talking', 'happy', 'raise-hand'];
const motionIds = ['idle', 'idle-3', ...overviewGestures];
const destinations = { work: 'happy', about: 'think', contact: 'raise-hand' };
const overviewPause = 5000;

function Character({ activeTab, replay, interaction }) {
  const asset = useLoader(GLTFLoader, import.meta.env.VITE_CHARACTER_MODEL || '/models/character.vrm',
    loader => loader.register(parser => new VRMLoaderPlugin(parser)));
  const motions = useLoader(GLTFLoader, motionIds.map(id => '/motions/' + id + '.vrma'),
    loader => loader.register(parser => new VRMAnimationLoaderPlugin(parser)));
  const avatar = asset.userData.vrm;
  const model = useMemo(() => {
    avatar.scene.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(avatar.scene);
    const scale = 1.7 / bounds.getSize(new Vector3()).y;
    const mixer = new AnimationMixer(avatar.scene);
    const actions = Object.fromEntries(motions.map((source, index) => [
      motionIds[index],
      mixer.clipAction(createVRMAnimationClip(source.userData.vrmAnimations[0], avatar)),
    ]));
    return { scale, floor: -bounds.min.y * scale, actions, mixer };
  }, [avatar, motions]);
  const previous = useRef(null);
  const ref = useRef();
  const { viewport } = useThree();
  useLayoutEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const idle = model.actions['idle-3'];
    const overview = activeTab === 'world';
    let gestureIndex = 0;
    let pauseTimer;

    function play(action, once = false) {
      const from = previous.current;
      action.reset().play();
      if (once) {
        action.setLoop(LoopOnce, 1);
        action.clampWhenFinished = true;
      }
      if (from && from !== action && !preference.matches) from.crossFadeTo(action, 0.48, false);
      previous.current = action;
    }

    function playOverviewIdle() {
      play(gestureIndex % 2 === 0 ? idle : model.actions.idle);
      pauseTimer = window.setTimeout(() => {
        play(model.actions[overviewGestures[gestureIndex]], true);
        gestureIndex = (gestureIndex + 1) % overviewGestures.length;
      }, overviewPause);
    }

    function start() {
      window.clearTimeout(pauseTimer);
      if (preference.matches) {
        model.mixer.stopAllAction();
        play(model.actions.idle);
        model.mixer.update(0);
        avatar.update(0);
      } else if (overview) {
        playOverviewIdle();
      } else {
        const gesture = model.actions[destinations[activeTab]];
        play(gesture || idle, Boolean(gesture));
      }
    }

    function finish(event) {
      if (event.action !== previous.current) return;
      if (overview) playOverviewIdle();
      else play(idle);
    }

    start();
    model.mixer.addEventListener('finished', finish);
    preference.addEventListener('change', start);
    return () => {
      window.clearTimeout(pauseTimer);
      model.mixer.removeEventListener('finished', finish);
      preference.removeEventListener('change', start);
    };
  }, [model, activeTab, replay, avatar]);
  useFrame((_, delta) => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) model.mixer.update(Math.min(delta, 0.25));
    avatar.update(Math.min(delta, 0.033));
    ref.current.rotation.y = interaction.current.rotation;
  });
  return <group ref={ref} position={[viewport.aspect > 1 ? 0.55 : 0, model.floor, 0]} scale={model.scale}>
    <primitive object={avatar.scene} />
  </group>;
}

function Stars() {
  const geometry = useMemo(() => {
    const data = new Float32Array(230 * 3);
    for (let i = 0; i < 230; i++) {
      const angle = i * 2.39996, radius = 1.4 + (i * 73 % 450) / 100;
      data[i * 3] = Math.cos(angle) * radius;
      data[i * 3 + 1] = 0.8 + Math.sin(angle) * radius;
      data[i * 3 + 2] = -3 - (i % 7) * 0.2;
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(data, 3));
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <points geometry={geometry}><pointsMaterial color="#dfc4e2" size={0.017} sizeAttenuation transparent opacity={0.8} depthWrite={false}/></points>;
}

function StageScene({ activeTab, replay }) {
  const { camera, gl } = useThree();
  const interaction = useRef({ rotation: 0, distance: 4 });
  useEffect(() => {
    camera.position.set(0, 0.92, 4); camera.lookAt(0, 0.88, 0);
    const canvas = gl.domElement;
    let lastX = null;
    const down = event => {
      if (event.button !== 0) return;
      lastX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
    };
    const move = event => {
      if (lastX === null) return;
      interaction.current.rotation = Math.max(-Math.PI, Math.min(Math.PI, interaction.current.rotation + (event.clientX - lastX) * 0.008));
      lastX = event.clientX;
    };
    const up = () => { lastX = null; };
    const wheel = event => {
      event.preventDefault();
      interaction.current.distance = Math.max(3.1, Math.min(5.5, interaction.current.distance + event.deltaY * 0.002));
    };
    canvas.style.touchAction = 'pan-y';
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('wheel', wheel, { passive: false });
    return () => { canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); canvas.removeEventListener('wheel', wheel); };
  }, [camera, gl]);
  useFrame((_, delta) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    camera.position.z += (interaction.current.distance - camera.position.z) * (reduced ? 1 : 1 - Math.exp(-8 * Math.min(delta,0.05)));
    camera.lookAt(0,0.88,0);
  });
  return <>
    <ambientLight color="#c9bbdc" intensity={0.85}/>
    <hemisphereLight args={['#fff0f5','#29203d',1.3]}/>
    <directionalLight position={[3, 4, 5]} intensity={2.1} color="#fff1ed"/>
    <directionalLight position={[-4, 2, 1]} intensity={1.05} color="#d0c4ff"/>
    <directionalLight position={[0, 3, -4]} intensity={2.1} color="#f2b8d4"/>
    <Stars/>
    <group position={[0.55,0.9,-1.5]}>
      <mesh><ringGeometry args={[1.37,1.374,128]}/><meshBasicMaterial color="#b38ba9" transparent opacity={0.22}/></mesh>
      <mesh rotation={[0,0,0.6]}><ringGeometry args={[1.61,1.614,128]}/><meshBasicMaterial color="#b6edf3" transparent opacity={0.1}/></mesh>
    </group>
    <Suspense fallback={null}><Character activeTab={activeTab} replay={replay} interaction={interaction}/></Suspense>
  </>;
}

export default function CharacterStage({ activeTab = 'world', replay = 0 }) {
  const fallback = <div role="status" style={{position:'absolute',inset:0,display:'grid',placeItems:'center',color:'#d5bdd3'}}>Character preview unavailable.</div>;
  return <div aria-label="Anime character preview" style={{position:'absolute',inset:0,overflow:'hidden',background:'radial-gradient(ellipse at 65% 47%, #483548 0%, #21192d 36%, #110f1a 78%)'}}>
    <StageErrorBoundary fallback={fallback}><Canvas dpr={[1,1.5]} camera={{fov:32,near:0.1,far:100}} gl={{antialias:true,alpha:true}}><StageScene activeTab={activeTab} replay={replay}/></Canvas></StageErrorBoundary>
  </div>;
}
