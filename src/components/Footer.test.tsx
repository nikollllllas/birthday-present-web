import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders without crashing and shows the current year', () => {
    render(<Footer />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(year))).toBeTruthy()
  })
})
