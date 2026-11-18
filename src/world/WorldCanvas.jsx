import { Component, Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';
import WorldEnvironment from './WorldEnvironment';
import Sky from './Sky';
import { updateWorld } from './worldState';

class SceneErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function Model() {
  const gltf = useLoader(GLTFLoader, import.meta.env.VITE_CHARACTER_MODEL || '/models/aemeath.glb');
  const model = useMemo(() => {
    const scene = clone(gltf.scene);
    const box = new Box3().setFromObject(scene), size = box.getSize(new Vector3());
    const scale = 1.7 / size.y;
    scene.scale.setScalar(scale);
    scene.position.set(-(box.min.x + box.max.x) * scale / 2, -box.min.y * scale, -(box.min.z + box.max.z) * scale / 2);
    return scene;
  }, [gltf]);
  return <primitive object={model} rotation-y={Number(import.meta.env.VITE_CHARACTER_FACING || 0)} />;
}
function Spirit() { return <mesh position={[0, 0.9, 0]}><sphereGeometry args={[0.22, 12, 12]} /><meshStandardMaterial color="#f2b8d4" emissive="#c378a4" emissiveIntensity={1} /></mesh>; }
const labels = [{ id: 'work', name: 'Memory Archive', point: [-17, 4.6, -6] }, { id: 'about', name: 'Star Observatory', point: [17, 4.9, -6] }, { id: 'contact', name: 'Signal Spire', point: [0, 5.1, -21] }];
function Scene({ stateRef, controls, paused, onLandmark, onStatus, labelRefs }) {
  const player = useRef();
  const { camera, gl, setFrameloop } = useThree();
  const statusTime = useRef(0);
  useFrame((_, delta) => {
    if (document.hidden) return;
    const state = stateRef.current;
    updateWorld(state, delta, controls);
    player.current.position.set(state.x, 0, state.z);
    player.current.rotation.y = state.facing;
    const horizontal = Math.cos(state.pitch) * state.distance;
    const pos = new Vector3(state.x + Math.sin(state.yaw) * horizontal, 1 + Math.sin(state.pitch) * state.distance, state.z + Math.cos(state.yaw) * horizontal);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) camera.position.copy(pos); else camera.position.lerp(pos, 1 - Math.exp(-5 * Math.min(delta, 0.05)));
    camera.lookAt(state.x, 0.8, state.z);
    camera.updateMatrixWorld();
    labels.forEach(({ point, id }) => {
      const node = labelRefs.current[id];
      if (!node) return;
      const projected = new Vector3(...point).project(camera);
      const visible = projected.z > -1 && projected.z < 1 && Math.abs(projected.x) < 0.88 && Math.abs(projected.y) < 0.78;
      node.style.visibility = visible ? 'visible' : 'hidden';
      if (visible) node.style.transform = `translate(-50%, -50%) translate(${(projected.x + 1) * gl.domElement.clientWidth / 2}px, ${(1 - projected.y) * gl.domElement.clientHeight / 2}px)`;
    });
    statusTime.current += delta;
    if (statusTime.current > 0.15) { statusTime.current = 0; onStatus({ region: state.region, nearby: state.nearby, entered: state.entered, x: state.x, z: state.z }); }
  });
  useEffect(() => {
    const visibility = () => setFrameloop(document.hidden ? 'never' : 'always');
    document.addEventListener('visibilitychange', visibility);
    visibility();
    return () => { document.removeEventListener('visibilitychange', visibility); setFrameloop('always'); };
  }, [setFrameloop]);
  useEffect(() => {
    const canvas = gl.domElement;
    const pointers = new Map();
    let pinchDistance = null;
    const pinch = () => { const [a, b] = [...pointers.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };
    const down = e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      canvas.setPointerCapture(e.pointerId);
      if (pointers.size === 2) pinchDistance = pinch();
    };
    const move = e => {
      const previous = pointers.get(e.pointerId);
      if (!previous) return;
      const dx = e.clientX - previous.x, dy = e.clientY - previous.y;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) controls.rotate(-dx * 0.005, dy * 0.005);
      else if (pointers.size === 2) {
        const distance = pinch();
        if (pinchDistance !== null) controls.zoom((pinchDistance - distance) * 0.025);
        pinchDistance = distance;
      }
    };
    const up = e => { pointers.delete(e.pointerId); pinchDistance = null; };
    const wheel = e => { e.preventDefault(); controls.zoom(e.deltaY * 0.01); };
    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('wheel', wheel, { passive: false });
    return () => {
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('wheel', wheel);
    };
  }, [controls, gl]);
  return <><Sky paused={paused}/><WorldEnvironment paused={paused} onLandmark={onLandmark}/><mesh rotation-x={-Math.PI/2} position={[0,-0.03,0]} onClick={e => { e.stopPropagation(); if (e.delta < 5) controls.setTarget(e.point.x,e.point.z); }}><planeGeometry args={[100,100]}/><meshBasicMaterial visible={false}/></mesh><group ref={player} position={[stateRef.current.x, 0, stateRef.current.z]}><SceneErrorBoundary fallback={<Spirit/>}><Suspense fallback={<Spirit/>}><Model/></Suspense></SceneErrorBoundary></group></>;
}
export default function WorldCanvas(props) {
  const labelRefs = useRef({});
  return <SceneErrorBoundary fallback={<div className="loading">The 3D world is unavailable. Use the navigation to explore the portfolio.</div>}>
    <Canvas shadows dpr={[1,1.5]} camera={{position:[4,5,14],fov:48,near:0.1,far:200}}><Scene {...props} labelRefs={labelRefs}/></Canvas>
    <div className="landmark-labels">{labels.map(({id,name}) => <button key={id} ref={node => { labelRefs.current[id] = node; }} onClick={() => props.onLandmark(id)}><span>✦</span> {name} <span>↗</span></button>)}</div>
  </SceneErrorBoundary>;
}
