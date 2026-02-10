import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import MyShelf from '../pages/MyShelf'

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('MyShelf', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  it('renders the initial item list', () => {
    renderWithRouter(<MyShelf />)

    expect(screen.getByRole('heading', { name: /マイシェルフ/i })).toBeInTheDocument()
    expect(screen.getByText('藍色のディナープレート')).toBeInTheDocument()
    expect(screen.getByText('手作りの湯呑み')).toBeInTheDocument()
    expect(screen.getByText('陶器のボウル')).toBeInTheDocument()
    expect(screen.getByText('ミニマルな花瓶')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /今日使った/i })).toHaveLength(4)
  })

  it('renders item card even when thumbnailUrl is missing', () => {
    window.localStorage.setItem(
      'utsuwa-diary-items',
      JSON.stringify([
        {
          id: 999,
          name: '画像なしの器',
          category: 'Misc',
          createdAt: new Date().toISOString(),
        },
      ])
    )

    renderWithRouter(<MyShelf />)

    expect(screen.getByText('画像なしの器')).toBeInTheDocument()
    expect(screen.getByText('画像なし')).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: '画像なしの器' })).not.toBeInTheDocument()
  })

  it('logs the selected item when clicking "今日使った"', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    renderWithRouter(<MyShelf />)

    await user.click(screen.getAllByRole('button', { name: /今日使った/i })[0])

    expect(consoleSpy).toHaveBeenCalledWith('Used Today: 藍色のディナープレート (Plate)')
  })
})
