import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import GraphiQLPage from '../pages/GraphiQLPage';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [{}, false, null],
}));

describe('<GraphiQLPage />', () => {
  it('sends a GraphQL query and displays the result', async () => {
    window.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: {
            characters: {
              info: {
                count: 107,
              },
              results: [{ name: 'Mechanical Rick' }],
            },
            location: { id: '1' },
            episodesByIds: [{ id: '1' }, { id: '2' }],
          },
        }),
    });

    await act(async () => {
      render(<GraphiQLPage />, { wrapper: BrowserRouter });
    });

    const input = screen.getByPlaceholderText(
      'https://rickandmortyapi.com/graphql',
    );
    fireEvent.change(input, {
      target: { value: 'https://rickandmortyapi.com/graphql' },
    });

    const queryInput = screen.getByPlaceholderText(/query Query/);
    fireEvent.change(queryInput, {
      target: {
        value: 'query { characters(page: 2, filter: { name: "rick" }) {...} }',
      },
    });

    const playButton = screen.getByLabelText('Start');
    fireEvent.click(playButton);

    await waitFor(() => {
      expect(screen.getByText(/"count": 107/)).toBeInTheDocument();
    });
  });

  it('allows the user to change the API URL', async () => {
    await act(async () => {
      render(<GraphiQLPage />, { wrapper: BrowserRouter });
    });
    const input = screen.getByPlaceholderText(
      'https://rickandmortyapi.com/graphql',
    ) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, {
        target: { value: 'https://newapi.com/graphql' },
      });
    });
    expect(input.value).toBe('https://newapi.com/graphql');
  });

  it('sends a GraphQL query and displays an error for an empty query', async () => {
    render(<GraphiQLPage />, { wrapper: BrowserRouter });

    window.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          errors: [
            {
              message:
                'GraphQL Error: Document does not contain any operations',
            },
          ],
        }),
    });

    const playButton = screen.getByLabelText('Start');
    fireEvent.click(playButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Document does not contain any operations/),
      ).toBeInTheDocument();
    });
  });

  it('changes the API URL', async () => {
    render(<GraphiQLPage />, { wrapper: BrowserRouter });
    const input = screen.getByPlaceholderText(
      'https://rickandmortyapi.com/graphql',
    ) as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: 'https://newapi.com/graphql' },
    });
    expect(input.value).toBe('https://newapi.com/graphql');
  });

  it('displays and hides additional options upon interaction', async () => {
    await act(async () => {
      render(<GraphiQLPage />, { wrapper: BrowserRouter });
    });

    const apiInput = screen.getByPlaceholderText(
      'https://rickandmortyapi.com/graphql',
    );
    fireEvent.change(apiInput, {
      target: { value: 'https://rickandmortyapi.com/graphql' },
    });

    await waitFor(() => {
      const toggleButton = screen.getByLabelText('Documentation');
      expect(toggleButton).toBeInTheDocument();

      fireEvent.click(toggleButton);
    });
  });
});
