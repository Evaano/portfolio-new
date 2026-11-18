export const LANDMARKS = {
  garden: { x: 0, z: 5, name: 'Arrival Garden' },
  work: { x: -17, z: -4, name: 'Memory Archive' },
  about: { x: 17, z: -4, name: 'Star Observatory' },
  contact: { x: 0, z: -20, name: 'Signal Spire' },
};

const islands = [[0, 0, 8.7], [-17, -6, 5.9], [17, -6, 5.9], [0, -21, 5.1]];
const bridges = [[-6, -2.1, -12.5, -4.4], [6, -2.1, 12.5, -4.4], [0, -6.5, 0, -17.5]];

function distanceToSegment(x, z, [ax, az, bx, bz]) {
  const dx = bx - ax, dz = bz - az;
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
  return Math.hypot(x - ax - t * dx, z - az - t * dz);
}

export function canWalk(x, z) {
  if (Math.hypot(x, z + 1.4) < 1.65) return false;
  return islands.some(([ix, iz, radius]) => Math.hypot(x - ix, z - iz) <= radius) ||
    bridges.some(bridge => distanceToSegment(x, z, bridge) <= 1.2);
}

export function createWorldState() {
  return { x: 0, z: 5, yaw: 0.25, pitch: 0.34, distance: 10, target: null,
    entered: false, moving: false, region: 'Arrival Garden', nearby: null, elapsed: 0, facing: Math.PI };
}

export function travelTo(state, id) {
  const destination = LANDMARKS[id];
  if (!destination) return false;
  state.x = destination.x;
  state.z = destination.z;
  state.target = null;
  state.entered = true;
  state.moving = false;
  updateRegion(state);
  return true;
}

function updateRegion(state) {
  const distances = Object.entries(LANDMARKS).map(([id, spot]) => [id, Math.hypot(state.x - spot.x, state.z - spot.z)]);
  const closest = distances.reduce((a, b) => a[1] < b[1] ? a : b);
  state.region = LANDMARKS[closest[0]].name;
  state.nearby = closest[0] !== 'garden' && closest[1] < 2.5 ? closest[0] : null;
}

// Inputs use positive forward/right; yaw describes the camera position behind the player.
export function updateWorld(state, delta, input = {}) {
  const dt = Math.max(0, Math.min(Number.isFinite(delta) ? delta : 0, 0.05));
  state.elapsed += dt;
  state.moving = false;
  if (input.blocked) return;
  let right = (input.right || 0) - (input.left || 0) + (input.joystickX || 0);
  let forward = (input.forward || 0) - (input.backward || 0) - (input.joystickY || 0);
  const manual = Math.hypot(right, forward) > 0.08;
  if (manual) state.target = null;
  let dx = 0, dz = 0;
  if (manual) {
    const magnitude = Math.hypot(right, forward);
    if (magnitude > 1) { right /= magnitude; forward /= magnitude; }
    dx = right * Math.cos(state.yaw) - forward * Math.sin(state.yaw);
    dz = -right * Math.sin(state.yaw) - forward * Math.cos(state.yaw);
  } else if (state.target) {
    dx = state.target.x - state.x;
    dz = state.target.z - state.z;
    const remaining = Math.hypot(dx, dz);
    if (remaining < 0.12) { state.target = null; dx = 0; dz = 0; }
    else { dx /= remaining; dz /= remaining; }
  }
  if (dx || dz) {
    state.entered = true;
    let step = (input.fast ? 5.5 : 3.1) * dt;
    if (state.target) step = Math.min(step, Math.hypot(state.target.x - state.x, state.target.z - state.z));
    const oldX = state.x, oldZ = state.z;
    const nextX = oldX + dx * step, nextZ = oldZ + dz * step;
    if (canWalk(nextX, nextZ)) { state.x = nextX; state.z = nextZ; }
    else {
      if (canWalk(nextX, oldZ)) state.x = nextX;
      if (canWalk(state.x, nextZ)) state.z = nextZ;
    }
    state.moving = Math.hypot(state.x - oldX, state.z - oldZ) > 0.0001;
    if (state.moving) state.facing = Math.atan2(dx, dz);
    else if (state.target) state.target = null;
  }
  updateRegion(state);
}
