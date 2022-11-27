import { render, screen } from '@testing-library/react';
import Cerberus from './Cerberus';

test('renders learn react link', () => {
  render(<Cerberus />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
