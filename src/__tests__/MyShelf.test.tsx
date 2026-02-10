import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import MyShelf from '../pages/MyShelf';

describe('MyShelf', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the initial item list', () => {
    render(<MyShelf />);

    expect(screen.getByRole('heading', { name: /my shelf/i })).toBeInTheDocument();
    expect(screen.getByText('Indigo Dinner Plate')).toBeInTheDocument();
    expect(screen.getByText('Handmade Tea Cup')).toBeInTheDocument();
    expect(screen.getByText('Stoneware Bowl')).toBeInTheDocument();
    expect(screen.getByText('Minimalist Flower Vase')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /used today/i })).toHaveLength(4);
  });

  it('logs the selected item when clicking "Used Today"', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    render(<MyShelf />);

    await user.click(screen.getAllByRole('button', { name: /used today/i })[0]);

    expect(consoleSpy).toHaveBeenCalledWith('Used Today: Indigo Dinner Plate (Plate)');
  });
});
