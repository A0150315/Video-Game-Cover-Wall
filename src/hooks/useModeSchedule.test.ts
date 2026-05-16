import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useModeSchedule } from './useModeSchedule';

describe('useModeSchedule', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts in cinematic mode', () => {
    const { result } = renderHook(() => useModeSchedule());
    expect(result.current.mode).toBe('cinematic');
  });

  it('cycles to gallery after cinematic duration', () => {
    const { result } = renderHook(() => useModeSchedule());
    act(() => { vi.advanceTimersByTime(180_000); });
    expect(result.current.mode).toBe('gallery');
  });

  it('cycles to spotlight after gallery duration', () => {
    const { result } = renderHook(() => useModeSchedule());
    act(() => { vi.advanceTimersByTime(180_000); });
    act(() => { vi.advanceTimersByTime(75_000); });
    expect(result.current.mode).toBe('spotlight');
  });

  it('cycles back to cinematic after full cycle', () => {
    const { result } = renderHook(() => useModeSchedule());
    act(() => { vi.advanceTimersByTime(180_000); });
    act(() => { vi.advanceTimersByTime(75_000); });
    act(() => { vi.advanceTimersByTime(45_000); });
    expect(result.current.mode).toBe('cinematic');
  });

  it('cycleMode(-1) goes to previous mode', () => {
    const { result } = renderHook(() => useModeSchedule());
    act(() => { result.current.cycleMode(-1); });
    expect(result.current.mode).toBe('spotlight');
  });

  it('cycleMode(1) goes to next mode', () => {
    const { result } = renderHook(() => useModeSchedule());
    act(() => { result.current.cycleMode(1); });
    expect(result.current.mode).toBe('gallery');
  });
});
