import bpy, math
from mathutils import Euler
from pathlib import Path
base=Path(__file__).resolve().parents[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(base/'public/models/aemeath.glb'))
rig=next(o for o in bpy.data.objects if o.type=='ARMATURE')
rig.animation_data_create()
clips={
 'Idle': {1:{},31:{'Bip001Spine2':(0.035,0,0.015),'Bip001Head':(-0.018,0.025,0),'Bip001LUpperArm':(0,0,0.025),'Bip001RUpperArm':(0,0,-0.025)},61:{},91:{'Bip001Spine2':(-0.018,0,-0.015),'Bip001Head':(0.012,-0.025,0)},121:{}},
 'TabGesture': {1:{},12:{'Bip001Spine2':(0,0.12,-0.09),'Bip001Head':(0,-0.16,0.05),'Bip001RUpperArm':(0.12,0,-0.35),'Bip001RForearm':(0,0,-0.55)},25:{'Bip001Spine2':(0,-0.10,0.06),'Bip001Head':(0,0.12,-0.05),'Bip001RUpperArm':(0.08,0,-0.22),'Bip001RForearm':(0,0,-0.35)},46:{}}
}
clips['Present'] = {1:{}, 9:{'Bip001Head':(0,.24,0)}, 18:{'Bip001Head':(0,.20,0),'Bip001Spine2':(0,.14,0),'Bip001LUpperArm':(.12,0,.43)}, 28:{'Bip001LUpperArm':(.18,.16,.57),'Bip001LForearm':(.12,.28,.44),'Bip001Head':(0,.16,0)}, 42:{'Bip001LUpperArm':(.17,.14,.53),'Bip001LForearm':(.12,.25,.40)}, 60:{}}
clips['Bow'] = {1:{}, 8:{'Bip001Head':(.12,0,0)}, 22:{'Bip001Spine':(.20,0,0),'Bip001Spine2':(.16,0,0),'Bip001Head':(.18,0,0)}, 34:{'Bip001Spine':(.19,0,0),'Bip001Spine2':(.15,0,0),'Bip001Head':(.16,0,0)}, 50:{'Bip001Head':(.08,0,0)}, 59:{}}
wave={'Bip001RUpperArm':(.24,0,-.78),'Bip001RForearm':(.18,0,-.90),'Bip001Head':(0,.12,-.09)}
clips['Greeting'] = {1:{}, 8:{'Bip001Head':(0,.16,-.07)}, 20:wave, 26:{**wave,'Bip001RHand':(0,.16,.32)}, 33:{**wave,'Bip001RHand':(0,-.12,-.28)}, 41:{**wave,'Bip001RHand':(0,.14,.25)}, 49:wave, 67:{}}
# Build a ten-second moving hold. Angles here are in character-space degrees.
def local_angles(name, xyz):
 orientation=(rig.matrix_world @ rig.data.bones[name].matrix_local).to_quaternion()
 world=Euler(tuple(math.radians(v) for v in xyz)).to_quaternion()
 return tuple((orientation.inverted() @ world @ orientation).to_euler())

def standing(frame):
 t=math.tau*(frame-1)/300
 sway=math.sin(t)
 breath=math.sin(3*t-.3)
 pose={}
 def turn(name, xyz):
  pose[name]=local_angles(name,xyz)
 turn('Bip001Spine',(2+2*breath,4+5*sway,-3+3*sway))
 turn('Bip001Spine2',(-1+2*math.sin(3*t-.65),-2-3*math.sin(t-.18),4*math.sin(t-.25)))
 turn('Bip001Head',(-3+2*math.sin(3*t-.8),-3+4*math.sin(t-.45),7*math.sin(t+.45)))
 for side,sign in [('L',1),('R',-1)]:
  turn('Bip001'+side+'UpperArm',(1+3*math.sin(t-.3),-sign*(14+3*math.sin(3*t-.5)),sign*3))
  turn('Bip001'+side+'Forearm',(-12-4*math.sin(t-.45),sign*3,sign*5))
  turn('Bip001'+side+'Hand',(-3+4*math.sin(t-.62),sign*3,sign*4))
  for finger in range(1,5):
   pose['Bip001'+side+'Finger'+str(finger)]=(0,0,sign*(.09+.025*finger))
  for depth in range(1,4):
   name=f'Bone_Hair00{depth}_{side}'
   turn(name,(2*math.sin(3*t-depth*.38),3*math.sin(t-depth*.31),0))
 return pose

clips['Idle']={frame:standing(frame) for frame in range(1,302,5)}
names=sorted({n for frames in clips.values() for pose in frames.values() for n in pose})
for label,frames in clips.items():
 action=bpy.data.actions.new(label)
 rig.animation_data.action=action
 for frame,pose in frames.items():
  for name in names:
   bone=rig.pose.bones.get(name)
   if bone is None: raise RuntimeError('Missing bone '+name)
   bone.rotation_mode='QUATERNION'
   bone.rotation_quaternion=Euler(pose.get(name,(0,0,0)), 'XYZ').to_quaternion()
   bone.keyframe_insert(data_path='rotation_quaternion',frame=frame,group=name)
 track=rig.animation_data.nla_tracks.new(); track.name=label
 track.strips.new(label,1,action)
 rig.animation_data.action=None
bpy.context.scene.render.fps=30
bpy.ops.export_scene.gltf(filepath=str(base/'public/models/aemeath-animated.glb'),export_format='GLB',export_animations=True,export_animation_mode='NLA_TRACKS')
