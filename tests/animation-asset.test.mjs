import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function asset(path) {
  const data = readFileSync(new URL('../public/' + path, import.meta.url));
  assert.equal(data.toString('ascii', 0, 4), 'glTF');
  return JSON.parse(data.toString('utf8', 20, 20 + data.readUInt32LE(12)));
}

test('avatar and section motions include animated humanoid arms', () => {
  const avatar = asset('models/character.vrm');
  assert.ok(avatar.skins.length && avatar.extensions.VRMC_vrm.humanoid.humanBones.leftHand);
  for (const name of ['idle', 'think', 'happy', 'idle-talking', 'raise-hand', 'idle-3']) {
    const motion = asset('motions/' + name + '.vrma');
    const bones = motion.extensions.VRMC_vrm_animation.humanoid.humanBones;
    const clip = motion.animations[0];
    for (const arm of ['leftUpperArm', 'rightUpperArm']) {
      const channel = clip.channels.find(c => c.target.node === bones[arm].node && c.target.path === 'rotation');
      assert.ok(channel && motion.accessors[clip.samplers[channel.sampler].input].count > 1, name + ' ' + arm);
    }
  }
});
