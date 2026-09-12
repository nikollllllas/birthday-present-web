import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ThemeToggle from './ThemeToggle'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.className = ''
  document.documentElement.removeAttribute('data-theme')
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  )
})

describe('ThemeToggle', () => {
  it('starts in auto mode and applies a resolved theme class', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button').textContent).toBe('Auto')
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })

  it('toggles to light mode and updates the document class on click', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(button.textContent).toBe('Light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
