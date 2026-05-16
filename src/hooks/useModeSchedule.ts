import { useState, useEffect, useCallback, useRef } from 'react';
import type { DisplayMode } from '../types/game';
import { MODE_SEQUENCE, MODE_DURATIONS } from '../types/game';

export function useModeSchedule() {
  const [mode, setMode] = useState<DisplayMode>('cinematic');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const scheduleNext = useCallback((current: DisplayMode) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setMode(prev => {
        const idx = MODE_SEQUENCE.indexOf(prev);
        const next = MODE_SEQUENCE[(idx + 1) % MODE_SEQUENCE.length];
        scheduleNext(next);
        return next;
      });
    }, MODE_DURATIONS[current]);
  }, []);

  useEffect(() => {
    scheduleNext(mode);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [mode, scheduleNext]);

  const cycleMode = useCallback((dir: 1 | -1) => {
    setMode(prev => {
      const idx = MODE_SEQUENCE.indexOf(prev);
      const nextIdx = (idx + dir + MODE_SEQUENCE.length) % MODE_SEQUENCE.length;
      const next = MODE_SEQUENCE[nextIdx];
      scheduleNext(next);
      return next;
    });
  }, [scheduleNext]);

  return { mode, cycleMode };
}
