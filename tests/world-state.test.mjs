import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorldState, updateWorld, canWalk, travelTo, LANDMARKS } from '../src/world/worldState.js';

test('every travel destination is walkable', () => {
  for (const [id, spot] of Object.entries(LANDMARKS)) {
    assert.ok(canWalk(spot.x, spot.z), id);
    const state = createWorldState();
    assert.ok(travelTo(state, id));
    assert.equal(state.x, spot.x);
    assert.equal(state.z, spot.z);
  }
  assert.equal(travelTo(createWorldState(), 'missing'), false);
});

test('camera-relative movement and diagonal speed', () => {
  const a = createWorldState(), b = createWorldState();
  a.yaw = b.yaw = Math.PI / 2;
  updateWorld(a, 0.05, { forward: true });
  updateWorld(b, 0.05, { forward: true, right: true });
  assert.ok(a.x < 0 && Math.abs(a.z - 5) < 1e-8);
  assert.ok(Math.abs(Math.hypot(a.x, a.z - 5) - Math.hypot(b.x, b.z - 5)) < 1e-8);
});

test('overlay blocks movement and large deltas are clamped', () => {
  const state = createWorldState();
  updateWorld(state, 100, { forward: true, blocked: true });
  assert.deepEqual([state.x, state.z], [0, 5]);
  updateWorld(state, 100, { forward: true });
  assert.ok(Math.hypot(state.x, state.z - 5) <= 3.1 * 0.05 + 1e-9);
});

test('island boundaries and central sculpture block walking', () => {
  assert.equal(canWalk(0, -1.4), false);
  assert.equal(canWalk(0, 9), false);
  const state = createWorldState();
  state.x = 0; state.z = 0.3; state.yaw = 0;
  updateWorld(state, 0.05, { forward: true });
  assert.ok(state.z >= 0.25);
});

test('bridges connect all islands along their center lines', () => {
  for (const [ax, az, bx, bz] of [[-6, -2.1, -12.5, -4.4], [6, -2.1, 12.5, -4.4], [0, -6.5, 0, -17.5]]) {
    for (let i = 0; i <= 100; i++) assert.ok(canWalk(ax + (bx - ax) * i / 100, az + (bz - az) * i / 100));
  }
});

test('click target completes, and manual input cancels it', () => {
  const state = createWorldState();
  state.target = { x: 0, z: 4 };
  for (let i = 0; i < 100 && state.target; i++) updateWorld(state, 0.05);
  assert.equal(state.target, null);
  assert.ok(Math.abs(state.z - 4) < 0.12);
  state.target = { x: 0, z: 2 };
  updateWorld(state, 0.05, { right: true });
  assert.equal(state.target, null);
});
