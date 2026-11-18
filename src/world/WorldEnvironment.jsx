import { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import project3d from '../assets/work/workImgThree.jpg';
import projectPlatformer from '../assets/work/workImgOne.jpg';
import projectHospital from '../assets/work/workImgTwo.png';

const C = { stone: '#d5d1dd', shadow: '#aaa3bb', dark: '#322b42', rock: '#51465f', pink: '#f2b8d4', rose: '#c378a4', cyan: '#b6edf3', metal: '#555363' };
const islands = [[0, 0, 9], [-17, -6, 6.2], [17, -6, 6.2], [0, -21, 5.4]];
const bridges = [[-6,-2.1,-12.5,-4.4],[6,-2.1,12.5,-4.4],[0,-6.5,0,-17.5]];
const trees = [[-5,4,1], [5,3,0.9],[-4,-5,0.9],[-20,-8,0.8],[20,-8,0.85],[3,-23,0.7]];

function Star({ position = [0,0,0], scale = 1, color = C.pink }) {
  return <group position={position} scale={scale}>
    <mesh rotation={[0,0,Math.PI/4]}><octahedronGeometry args={[0.35,0]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} metalness={0.3} /></mesh>
    <mesh><boxGeometry args={[0.08,1.1,0.07]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5}/></mesh>
    <mesh><boxGeometry args={[0.65,0.06,0.07]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5}/></mesh>
  </group>;
}

function Pillar({ position, height = 3.2 }) {
  return <group position={position}>
    <mesh position={[0,height/2,0]} castShadow><boxGeometry args={[0.35,height,0.35]} /><meshStandardMaterial color={C.stone}/></mesh>
    <mesh position={[0,0.12,0]}><boxGeometry args={[0.62,0.24,0.62]} /><meshStandardMaterial color={C.shadow}/></mesh>
    <mesh position={[0,height,0]}><boxGeometry args={[0.55,0.22,0.55]} /><meshStandardMaterial color={C.dark}/></mesh>
  </group>;
}
function Arch({ position, rotation = 0, scale = 1 }) {
  return <group position={position} rotation={[0,rotation,0]} scale={scale}>
    <Pillar position={[-1.5,0,0]}/><Pillar position={[1.5,0,0]}/>
    <mesh position={[0,3.2,0]}><torusGeometry args={[1.5,0.18,6,32,Math.PI]} /><meshStandardMaterial color={C.stone}/></mesh>
    <mesh position={[0,3.22,-0.07]}><torusGeometry args={[1.5,0.045,6,32,Math.PI]} /><meshStandardMaterial color={C.metal} metalness={0.8} roughness={0.3}/></mesh>
    <Star position={[0,4.85,0]} scale={0.4}/>
  </group>;
}
function Lantern({position}) {
  return <group position={position}>
    <mesh position={[0,0.65,0]}><cylinderGeometry args={[0.07,0.11,1.3,6]} /><meshStandardMaterial color={C.dark} /></mesh>
    <mesh position={[0,1.42,0]}><octahedronGeometry args={[0.22,0]} /><meshStandardMaterial color={C.pink} emissive={C.pink} emissiveIntensity={1.1} /></mesh>
    <mesh position={[0,1.68,0]}><coneGeometry args={[0.27,0.19,4]} /><meshStandardMaterial color={C.metal} /></mesh>
  </group>;
}
function Island({ x, z, radius }) {
  return <group position={[x,0,z]}>
    <mesh position={[0,-0.3,0]} receiveShadow><cylinderGeometry args={[radius,radius*0.95,0.6,48]} /><meshStandardMaterial color={C.stone} roughness={0.9}/></mesh>
    <mesh position={[0,-1.8,0]} castShadow><cylinderGeometry args={[radius*0.95,radius*0.25,3,12]} /><meshStandardMaterial color={C.rock} flatShading /></mesh>
    <mesh position={[0,-3.5,0]}><coneGeometry args={[radius*0.25,1.1,9]} /><meshStandardMaterial color={C.rock} flatShading /></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.012,0]}><ringGeometry args={[radius*0.77,radius*0.78,64]} /><meshStandardMaterial color={C.shadow} side={THREE.DoubleSide}/></mesh>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.014,0]}><ringGeometry args={[radius*0.82,radius*0.824,64]} /><meshStandardMaterial color={C.metal} side={THREE.DoubleSide}/></mesh>
    {Array.from({length: 18}, (_,i) => { const a = i*Math.PI*2/18; return <mesh key={i} position={[Math.cos(a)*radius*0.7,0.02,Math.sin(a)*radius*0.7]} rotation={[-Math.PI/2,0,-a]}><planeGeometry args={[0.14,0.45]} /><meshStandardMaterial color={C.shadow}/></mesh>; })}
  </group>;
}
function Bridge({ ends }) {
  const [x1,z1,x2,z2]=ends, dx=x2-x1,dz=z2-z1, length=Math.hypot(dx,dz), angle=Math.atan2(dx,dz);
  return <group position={[(x1+x2)/2,0,(z1+z2)/2]} rotation={[0,angle,0]}>
    <mesh position={[0,-0.18,0]} receiveShadow><boxGeometry args={[2.7,0.36,length+0.7]} /><meshStandardMaterial color={C.shadow}/></mesh>
    {Array.from({length: Math.ceil(length/0.75)},(_,i)=><mesh key={i} position={[0,0.012,-length/2+i*0.75]}><boxGeometry args={[2.55,0.04,0.68]} /><meshStandardMaterial color={i%3===0 ? '#c4bfd0' : C.stone}/></mesh>)}
    {[-1,1].map(side=><group key={side} position={[side*1.42,0,0]}>
      <mesh position={[0,0.64,0]}><boxGeometry args={[0.09,0.09,length+0.7]}/><meshStandardMaterial color={C.metal} metalness={0.7}/></mesh>
      {Array.from({length: Math.floor(length/1.6)+1},(_,i)=><mesh key={i} position={[0,0.32,-length/2+i*1.6]}><boxGeometry args={[0.12,0.64,0.12]}/><meshStandardMaterial color={C.dark}/></mesh>)}
    </group>)}
  </group>;
}
function Branch({ a, b, width }) {
  const start=new THREE.Vector3(...a), end=new THREE.Vector3(...b), delta=end.clone().sub(start), middle=start.clone().add(end).multiplyScalar(0.5);
  const rotation=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.clone().normalize());
  return <mesh position={middle} quaternion={rotation} castShadow><cylinderGeometry args={[width*0.45,width,delta.length(),6]}/><meshStandardMaterial color="#504050" roughness={1}/></mesh>;
}
function BlossomTree({ position, scale = 1 }) {
  const flowers = useRef();
  const data=useMemo(()=>{
    const branches=[], blooms=[];
    for(let i=0;i<7;i++) {
      const a=i*Math.PI*2/7+0.2, tip=[Math.cos(a)*1.35,2.3+(i%3)*0.32,Math.sin(a)*1.35];
      branches.push({a:[0,1.0+i*0.09,0], b:tip, width:0.10});
      for(let j=0;j<10;j++) {
        const t=0.5+j*0.055, theta=j*2.4+i, x=tip[0]*t+Math.cos(theta)*0.15, y=tip[1]*t+0.35+Math.sin(theta)*0.14,z=tip[2]*t+Math.sin(theta)*0.15;
        blooms.push([x,y,z,(i+j)%3]);
      }
    }
    return {branches,blooms};
  },[]);
  const meshRef = node => {
    if (!node || flowers.current===node) return;
    flowers.current=node;
    const dummy=new THREE.Object3D(), color=new THREE.Color();
    data.blooms.forEach(([x,y,z,v],i)=>{
      const orientation = new THREE.Quaternion().setFromEuler(new THREE.Euler(i*1.7,i*0.9,i*0.4));
      for(let petal=0;petal<5;petal++) {
        const angle=petal*Math.PI*2/5;
        const offset=new THREE.Vector3(Math.cos(angle)*0.065,Math.sin(angle)*0.065,0).applyQuaternion(orientation);
        dummy.position.set(x+offset.x,y+offset.y,z+offset.z);
        dummy.quaternion.copy(orientation).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),angle));
        dummy.scale.set(0.09,0.052,0.018); dummy.updateMatrix();
        const index=i*5+petal; node.setMatrixAt(index,dummy.matrix);
        color.set(v===0?'#ffe6ee':v===1?'#f2b8d4':'#d99abc'); node.setColorAt(index,color);
      }
    });
    node.instanceMatrix.needsUpdate=true; if(node.instanceColor) node.instanceColor.needsUpdate=true;
  };
  return <group position={position} scale={scale}>
    <Branch a={[0,0,0]} b={[0,2.3,0]} width={0.18}/>
    {data.branches.map((branch,i)=><Branch key={i} {...branch}/>)}
    <instancedMesh ref={meshRef} args={[null,null,data.blooms.length*5]}><sphereGeometry args={[1,6,4]}/><meshStandardMaterial roughness={0.9}/></instancedMesh>
  </group>;
}
function Astrolabe({paused}) {
 const ring=useRef();
 useFrame((_,delta)=>{ if (!paused && ring.current) ring.current.rotation.y += Math.min(delta,0.05)*0.12; });
 return <group position={[0,0,-1.4]}>
   {[1.5,1.2,0.9].map((r,i)=><mesh key={r} position={[0,0.12+i*0.16,0]}><cylinderGeometry args={[r,r+0.1,0.25,32]}/><meshStandardMaterial color={i===2?C.dark:C.stone}/></mesh>)}
   <group ref={ring} position={[0,2.25,0]}>
     {[0,1,2].map(i=><mesh key={i} rotation={[i*0.9,i*1.1,0]}><torusGeometry args={[1.35-i*0.12,0.045,8,80]}/><meshStandardMaterial color={i===1?C.pink:C.metal} emissive={i===1?C.rose:'#000000'} emissiveIntensity={0.65} metalness={0.8}/></mesh>)}
     <Star scale={1.5}/>
   </group>
 </group>;
}
function Archive({onLandmark}) {
 const textures=useLoader(THREE.TextureLoader,[project3d,projectPlatformer,projectHospital]);
 return <group position={[-17,0,-6]} onClick={e=>{e.stopPropagation();onLandmark?.('work');}}>
   <Arch position={[0,0,-2.3]} scale={1.1}/><Arch position={[-3.7,0,-0.5]} rotation={Math.PI/2} scale={0.75}/><Arch position={[3.7,0,-0.5]} rotation={Math.PI/2} scale={0.75}/>
   {textures.map((texture,i)=><group key={i} position={[(i-1)*2.15,1.6,-1.8]}>
     <mesh><boxGeometry args={[1.85,1.3,0.16]}/><meshStandardMaterial color={C.dark}/></mesh>
     <mesh position={[0,0,0.09]}><planeGeometry args={[1.65,1.1]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>
     <mesh position={[0,-1,0]}><boxGeometry args={[0.16,1.0,0.16]}/><meshStandardMaterial color={C.metal}/></mesh>
   </group>)}
   <Lantern position={[-4,0,2]}/><Lantern position={[4,0,2]}/>
 </group>;
}
function Observatory({onLandmark}) {
 return <group position={[17,0,-6]} onClick={e=>{e.stopPropagation();onLandmark?.('about');}}>
   <Arch position={[0,0,-3]} scale={1.2}/><Pillar position={[-3.8,0,1]} height={2.4}/><Pillar position={[3.8,0,1]} height={2.4}/>
   <mesh position={[0,0.2,0]}><cylinderGeometry args={[2.1,2.3,0.4,32]}/><meshStandardMaterial color={C.stone}/></mesh>
   <mesh position={[0,2.1,0]}><sphereGeometry args={[0.9,32,24]}/><meshStandardMaterial color="#ece8f4" roughness={0.85}/></mesh>
   {[0,1].map(i=><mesh key={i} position={[0,2.1,0]} rotation={[i*0.9,0.3,i*0.8]}><torusGeometry args={[1.55,0.035,8,64]}/><meshStandardMaterial color={C.metal} metalness={0.8}/></mesh>)}
   <Lantern position={[-3,0,3]}/><Lantern position={[3,0,3]}/>
 </group>;
}
function Spire({onLandmark}) {
 return <group position={[0,0,-21]} onClick={e=>{e.stopPropagation();onLandmark?.('contact');}}>
  {[2.1,1.6,1.1].map((r,i)=><mesh key={r} position={[0,0.13+i*0.25,0]}><cylinderGeometry args={[r,r+0.1,0.25,8]}/><meshStandardMaterial color={i===2?C.dark:C.stone}/></mesh>)}
  <mesh position={[0,2.1,0]}><cylinderGeometry args={[0.38,0.65,3.4,6]}/><meshStandardMaterial color={C.dark} metalness={0.4}/></mesh>
  <mesh position={[0,4.1,0]}><octahedronGeometry args={[0.6,0]}/><meshStandardMaterial color={C.pink} emissive={C.rose} emissiveIntensity={1}/></mesh>
  <mesh position={[0,7,0]}><cylinderGeometry args={[0.04,0.18,5.5,8,1,true]}/><meshBasicMaterial color={C.pink} transparent opacity={0.09} depthWrite={false} side={THREE.DoubleSide}/></mesh>
  <Lantern position={[-3,0,1]}/><Lantern position={[3,0,1]}/>
 </group>;
}
function Planes({paused}) {
 const ref=useRef();
 useFrame((state)=>{if(!paused && ref.current) ref.current.rotation.y=state.clock.elapsedTime*0.035;});
 return <group ref={ref}>
  {Array.from({length:8},(_,i)=>{ const a=i*Math.PI/4; return <group key={i} position={[Math.cos(a)*11,5+(i%3),-7+Math.sin(a)*10]} rotation={[0,-a,0.2]}>
    <mesh rotation={[0,0,Math.PI/2]}><coneGeometry args={[0.22,0.8,3]}/><meshStandardMaterial color={C.stone} side={THREE.DoubleSide}/></mesh>
  </group>;})}
 </group>;
}
export default function WorldEnvironment({ onLandmark, paused = false }) {
 return <>
  <ambientLight intensity={0.8} color="#dcd0ec"/><hemisphereLight args={['#f7e6ef','#453c59',1.1]}/>
  <directionalLight position={[8,18,10]} intensity={1.5} color="#fff2ed" castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} shadow-camera-far={70}/>
  {islands.map(([x,z,r])=><Island key={`${x},${z}`} x={x} z={z} radius={r}/>)}
  {bridges.map((b,i)=><Bridge key={i} ends={b}/>)}
  {trees.map(([x,z,s],i)=><BlossomTree key={i} position={[x,0,z]} scale={s}/>)}
  <Astrolabe paused={paused}/><Archive onLandmark={onLandmark}/><Observatory onLandmark={onLandmark}/><Spire onLandmark={onLandmark}/>
  <Lantern position={[-6,0,-2]}/><Lantern position={[6,0,-2]}/><Lantern position={[-1.8,0,-6]}/><Lantern position={[1.8,0,-6]}/>
  <Planes paused={paused}/>
 </>;
}
