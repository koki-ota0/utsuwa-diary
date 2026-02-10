import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ItemRegister from '../pages/ItemRegister'

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('ItemRegister', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('shows a validation message when more than 3 photos are selected', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ItemRegister />)

    const input = document.getElementById('photos') as HTMLInputElement
    const files = [
      new File(['a'], 'a.png', { type: 'image/png' }),
      new File(['b'], 'b.png', { type: 'image/png' }),
      new File(['c'], 'c.png', { type: 'image/png' }),
      new File(['d'], 'd.png', { type: 'image/png' }),
    ]

    await user.upload(input, files)

    expect(screen.getByText('写真は3枚までです')).toBeInTheDocument()
    expect(screen.getByText(/3 \/ 3 枚選択中/)).toBeInTheDocument()
  })

  it('submits a payload when required form fields are valid', async () => {
    const user = userEvent.setup()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    renderWithRouter(<ItemRegister />)

    await user.type(document.getElementById('name') as HTMLInputElement, '青いマグカップ')
    await user.click(screen.getByRole('button', { name: /カップ・湯呑み/i }))
    await user.type(document.getElementById('brandShop') as HTMLInputElement, '地元の工房')
    await user.type(document.getElementById('notes') as HTMLTextAreaElement, '友人からの贈り物')

    await user.click(screen.getByRole('button', { name: /登録する/i }))

    expect(consoleSpy).toHaveBeenCalledWith(
      'Saved item to localStorage:',
      expect.objectContaining({
        name: '青いマグカップ',
        category: 'Cup',
        brandShop: '地元の工房',
        notes: '友人からの贈り物',
      }),
    )
  })
})
