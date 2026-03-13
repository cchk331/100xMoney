import { describe, it, expect } from 'vitest'

describe('Smoke tests', () => {
  it('should have correct environment', () => {
    expect(true).toBe(true)
  })

  it('should have required dependencies', async () => {
    const react = await import('react')
    expect(react).toBeDefined()
    const next = await import('next/navigation')
    expect(next).toBeDefined()
  })
})
