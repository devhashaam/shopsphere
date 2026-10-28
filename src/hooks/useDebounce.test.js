import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import useDebounce from './useDebounce.js'

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('only returns the latest value after the delay has passed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'p' },
    })

    rerender({ value: 'ph' })
    rerender({ value: 'phone' })
    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toBe('p') // still the old value

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('phone') // intermediate "ph" was skipped
  })
})
