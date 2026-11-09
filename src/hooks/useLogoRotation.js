import { useEffect } from 'react';
import { dragRotation, keyboardRotation } from '../utils/logoRotation';

export default function useLogoRotation(logoRef) {
  useEffect(() => {
    const logo = logoRef.current;
    let rotation = { pitch: 0, yaw: 0 };
    let gesture = null;

    const applyRotation = (next) => {
      rotation = next;
      logo.style.setProperty('--logo-pitch', `${next.pitch}deg`);
      logo.style.setProperty('--logo-yaw', `${next.yaw}deg`);
    };

    const finish = () => {
      const pointerId = gesture?.pointerId;
      gesture = null;
      delete logo.dataset.dragging;
      if (pointerId !== undefined && logo.hasPointerCapture(pointerId)) logo.releasePointerCapture(pointerId);
    };

    const onPointerDown = (event) => {
      if (!event.isPrimary || event.button !== 0 || gesture) return;
      gesture = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, rotation };
      logo.dataset.dragging = 'true';
      logo.setPointerCapture(event.pointerId);
      logo.focus({ preventScroll: true });
    };

    const onPointerMove = (event) => {
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      applyRotation(dragRotation(gesture.rotation, event.clientX - gesture.x, event.clientY - gesture.y));
    };

    const onPointerEnd = (event) => {
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      if (event.type === 'pointerup') onPointerMove(event);
      finish();
    };

    const onKeyDown = (event) => {
      const next = keyboardRotation(rotation, event.key);
      if (!next) return;
      event.preventDefault();
      finish();
      applyRotation(next);
    };

    const onVisibilityChange = () => { if (document.hidden) finish(); };
    logo.addEventListener('pointerdown', onPointerDown);
    logo.addEventListener('pointermove', onPointerMove);
    logo.addEventListener('pointerup', onPointerEnd);
    logo.addEventListener('pointercancel', onPointerEnd);
    logo.addEventListener('lostpointercapture', finish);
    logo.addEventListener('keydown', onKeyDown);
    logo.addEventListener('blur', finish);
    window.addEventListener('blur', finish);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      finish();
      logo.removeEventListener('pointerdown', onPointerDown);
      logo.removeEventListener('pointermove', onPointerMove);
      logo.removeEventListener('pointerup', onPointerEnd);
      logo.removeEventListener('pointercancel', onPointerEnd);
      logo.removeEventListener('lostpointercapture', finish);
      logo.removeEventListener('keydown', onKeyDown);
      logo.removeEventListener('blur', finish);
      window.removeEventListener('blur', finish);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [logoRef]);
}
