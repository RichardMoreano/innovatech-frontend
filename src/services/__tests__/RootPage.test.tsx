import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useRouter } from 'next/navigation';
import RootPage from '@/app/page'; 

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('RootPage - Middleware de Ruteo en Cliente', () => {
  const mockReplace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, 'getItem').mockReset();
    
    vi.mocked(useRouter).mockReturnValue({
      replace: mockReplace,
    } as any);
  });

  it('Debería mostrar el estado visual de redirección inmediatamente', () => {
    render(<RootPage />);
    
    expect(screen.getByText('Redirigiendo al ecosistema...')).toBeInTheDocument();
    expect(document.querySelector('svg.animate-spin')).toBeTruthy();
  });

  it('Debería redirigir al /dashboard si existe un token válido en localStorage', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('un-token-valido-123');

    render(<RootPage />);

    await waitFor(() => {
      expect(localStorage.getItem).toHaveBeenCalledWith('token');
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('Debería redirigir al /login si no existe un token en localStorage', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    render(<RootPage />);

    await waitFor(() => {
      expect(localStorage.getItem).toHaveBeenCalledWith('token');
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });
});