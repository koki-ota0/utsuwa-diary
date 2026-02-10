import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ItemRegister from '../pages/ItemRegister';

describe('ItemRegister', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a validation message when more than 3 photos are selected', async () => {
    const user = userEvent.setup();
    render(<ItemRegister />);

    const input = screen.getByLabelText(/photo upload/i);
    const files = [
      new File(['a'], 'a.png', { type: 'image/png' }),
      new File(['b'], 'b.png', { type: 'image/png' }),
      new File(['c'], 'c.png', { type: 'image/png' }),
      new File(['d'], 'd.png', { type: 'image/png' }),
    ];

    await user.upload(input, files);

    expect(screen.getByText('You can upload up to 3 photos.')).toBeInTheDocument();
    expect(screen.getByText('3 / 3 selected')).toBeInTheDocument();
  });

  it('submits a payload when required form fields are valid', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    render(<ItemRegister />);

    await user.type(screen.getByLabelText(/^name$/i), 'Blue Mug');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Cup');
    await user.type(screen.getByLabelText(/brand \/ shop/i), 'Local Studio');
    await user.type(screen.getByLabelText(/notes/i), 'Gift from a friend');

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(consoleSpy).toHaveBeenCalledWith(
      'Item registration payload:',
      expect.objectContaining({
        name: 'Blue Mug',
        category: 'Cup',
        brandShop: 'Local Studio',
        notes: 'Gift from a friend',
      }),
    );
  });
});
