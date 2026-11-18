import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Sky({ paused = false }) {
  const stars=useRef(), petals=useRef();
  const starPositions=useMemo(()=>Array.from({length:180},(_,i)=>{
    const angle=i*2.39996, radius=42+(i*37%90);
    return [Math.cos(angle)*radius,12+(i*23%65),Math.sin(angle)*radius-12];
  }),[]);
  const setupStars=node=>{
    if(!node || stars.current===node) return; stars.current=node;
    const dummy=new THREE.Object3D();
    starPositions.forEach((p,i)=>{ dummy.position.set(...p); dummy.scale.setScalar(i%11===0?0.18:0.07); dummy.updateMatrix(); node.setMatrixAt(i,dummy.matrix); });
    node.instanceMatrix.needsUpdate=true;
  };
  const setupPetals=node=>{
    if(!node || petals.current===node) return; petals.current=node;
    const dummy=new THREE.Object3D();
    for(let i=0;i<60;i++){ const a=i*2.39996,r=3+(i*11%270)/10; dummy.position.set(Math.cos(a)*r,0.7+(i*17%60)/10,Math.sin(a)*r-8); dummy.rotation.set(i, i*0.7, i*0.3); dummy.scale.setScalar(0.06+(i%3)*0.015); dummy.updateMatrix(); node.setMatrixAt(i,dummy.matrix); }
    node.instanceMatrix.needsUpdate=true;
  };
  useFrame((_,delta)=>{if(!paused && petals.current) petals.current.rotation.y+=Math.min(delta,0.05)*0.015;});
  return <>
    <color attach="background" args={['#171321']}/><fog attach="fog" args={['#292337',35,125]}/>
    <mesh position={[-46,38,-95]}><sphereGeometry args={[11,48,32]}/><meshBasicMaterial color="#c582aa"/></mesh>
    <instancedMesh ref={setupStars} args={[null,null,starPositions.length]}><octahedronGeometry args={[1,0]}/><meshBasicMaterial color="#f5e6f0"/></instancedMesh>
    <instancedMesh ref={setupPetals} args={[null,null,60]}><sphereGeometry args={[1,6,4]}/><meshBasicMaterial color="#f2b8d4"/></instancedMesh>
    <mesh position={[0,-8,-10]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[450,450]}/><meshStandardMaterial color="#201c34" metalness={0.5} roughness={0.35}/></mesh>
    {Array.from({length:14},(_,i)=>{const angle=i*2.4,r=40+(i%4)*9;return <mesh key={i} position={[Math.cos(angle)*r,-3-(i%4)*2,Math.sin(angle)*r-10]} rotation={[i,0,i*0.6]} scale={[2+(i%3),1.4,2]}><icosahedronGeometry args={[1,0]}/><meshStandardMaterial color="#453b52" flatShading/></mesh>;})}
  </>;
}
