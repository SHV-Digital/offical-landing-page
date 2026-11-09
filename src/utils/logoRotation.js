const clampPitch = (pitch) => Math.max(-55, Math.min(55, pitch));

export function dragRotation(start, deltaX, deltaY) {
  return {
    pitch: clampPitch(start.pitch - deltaY * 0.3),
    yaw: (start.yaw + deltaX * 0.5) % 360,
  };
}

export function keyboardRotation(current, key) {
  switch (key) {
    case 'ArrowLeft': return { ...current, yaw: (current.yaw - 15) % 360 };
    case 'ArrowRight': return { ...current, yaw: (current.yaw + 15) % 360 };
    case 'ArrowUp': return { ...current, pitch: clampPitch(current.pitch - 10) };
    case 'ArrowDown': return { ...current, pitch: clampPitch(current.pitch + 10) };
    case 'Home': return { pitch: 0, yaw: 0 };
    default: return null;
  }
}
