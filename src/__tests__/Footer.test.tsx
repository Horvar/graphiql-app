import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('should display the correct year range', () => {
    const yearTexts = screen.getAllByText('2023 — 2024');
    expect(yearTexts).toHaveLength(2);
  });

  it('should display the correct logo alt text', () => {
    const logo = screen.getByAltText('RSShool React Course');
    expect(logo).toBeInTheDocument();
  });

  it('should have correct links to GitHub profiles', () => {
    const links = screen.getAllByRole('link', { name: /GitHub/i });
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute('href', 'https://github.com/horvar');
    expect(links[1]).toHaveAttribute('href', 'https://github.com/dimash95');
    expect(links[2]).toHaveAttribute('href', 'https://github.com/almasklchv');
  });
});
