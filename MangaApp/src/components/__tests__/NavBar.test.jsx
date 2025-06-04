import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../NavBar';
import { AuthProvider } from '../../contexts/AuthContext';

describe('NavBar', () => {
  const renderNavBar = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <NavBar />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('renders navigation links correctly', () => {
    renderNavBar();

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /library/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /history/i })).toBeInTheDocument();
  });

  it('shows login/register links when user is not authenticated', () => {
    renderNavBar();

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  it('shows user menu when user is authenticated', () => {
    localStorage.setItem('token', 'test-token');
    renderNavBar();

    expect(screen.getByRole('button', { name: /user menu/i })).toBeInTheDocument();
  });

  it('shows admin link when user is admin', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ role: 'admin' }));
    renderNavBar();

    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
  });

  it('handles search input correctly', async () => {
    renderNavBar();

    const searchInput = screen.getByPlaceholderText(/search manga/i);
    await userEvent.type(searchInput, 'test manga');

    expect(searchInput).toHaveValue('test manga');
  });

  it('shows logout option in user menu when authenticated', async () => {
    localStorage.setItem('token', 'test-token');
    renderNavBar();

    const userMenuButton = screen.getByRole('button', { name: /user menu/i });
    await userEvent.click(userMenuButton);

    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
}); 