import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the character creation home page', () => {
  render(<App />);
  const linkElement = screen.getByRole('heading', { name: /criador de fichas de rpg/i });
  expect(linkElement).toBeInTheDocument();
});
