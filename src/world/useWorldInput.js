import { useEffect, useRef } from 'react';
import { canWalk } from './worldState';

export function useWorldInput(stateRef, blocked, onInteract, onMap) {
  const callbacks = useRef({ onInteract, onMap });
  callbacks.current = { onInteract, onMap };
  const input = useRef(null);
  if (!input.current) {
    const controls = { forward: false, backward: false, left: false, right: false, fast: false,
      joystickX: 0, joystickY: 0, blocked: false, pressed: new Set() };
    controls.clear = () => {
      controls.forward = controls.backward = controls.left = controls.right = controls.fast = false;
      controls.joystickX = controls.joystickY = 0;
      controls.pressed.clear();
      stateRef.current.target = null;
    };
    controls.setJoystick = (x, y) => { controls.joystickX = x; controls.joystickY = y; };
    controls.setTarget = (x, z) => {
      if (!controls.blocked && canWalk(x, z)) { stateRef.current.target = { x, z }; stateRef.current.entered = true; }
    };
    controls.rotate = (x, y = 0) => {
      stateRef.current.yaw += x;
      stateRef.current.pitch = Math.max(0.16, Math.min(0.9, stateRef.current.pitch + y));
    };
    controls.zoom = amount => { stateRef.current.distance = Math.max(6, Math.min(18, stateRef.current.distance + amount)); };
    input.current = controls;
  }
  useEffect(() => {
    const controls = input.current;
    controls.blocked = blocked;
    if (blocked) controls.clear();
  }, [blocked]);
  useEffect(() => {
    const controls = input.current;
    const mapping = { w: 'forward', arrowup: 'forward', s: 'backward', arrowdown: 'backward',
      a: 'left', arrowleft: 'left', d: 'right', arrowright: 'right', shift: 'fast' };
    const down = e => {
      if (e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      const key = e.key.toLowerCase();
      if (controls.blocked) return;
      if (mapping[key]) { controls.pressed.add(key); controls[mapping[key]] = true; e.preventDefault(); }
      else if (!e.repeat && key === 'e') callbacks.current.onInteract?.(stateRef.current.nearby);
      else if (!e.repeat && key === 'm') { e.preventDefault(); callbacks.current.onMap?.(); }
    };
    const up = e => {
      const key = e.key.toLowerCase(), action = mapping[key];
      if (action) {
        controls.pressed.delete(key);
        controls[action] = [...controls.pressed].some(pressed => mapping[pressed] === action);
      }
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', controls.clear);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', controls.clear); };
  }, [stateRef]);
  return input.current;
}
