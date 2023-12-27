import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import GraphiQLPage from '../pages/GraphiQLPage';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import languageReducer from '../store/languageSlice';

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: () => [{}, false, null],
}));

const store = configureStore({
  reducer: {
    language: languageReducer,
  },
});

describe('<GraphiQLPage />', () => {
  beforeEach(() => {
    Storage.prototype.setItem = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends a GraphQL query and displays the result', async () => {
    window.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          /* ваш мок-ответ */
        }),
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <GraphiQLPage />
        </BrowserRouter>
      </Provider>,
    );

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

    window.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ data: { characters: { info: { count: 107 } } } }),
    });

    fireEvent.click(playButton);

    // Ожидание получения данных и проверка
    await waitFor(() => {
      expect(screen.getByText(/"count": 107/)).toBeInTheDocument();
    });
  });

  it('allows the user to change the API URL', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <GraphiQLPage />
          </BrowserRouter>
        </Provider>,
      );
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
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GraphiQLPage />
        </BrowserRouter>
      </Provider>,
    );

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
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GraphiQLPage />
        </BrowserRouter>
      </Provider>,
    );

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
      render(
        <Provider store={store}>
          <BrowserRouter>
            <GraphiQLPage />
          </BrowserRouter>
        </Provider>,
      );
    });

    const apiInput = screen.getByPlaceholderText(
      'https://rickandmortyapi.com/graphql',
    );
    fireEvent.change(apiInput, {
      target: { value: 'https://rickandmortyapi.com/graphql' },
    });

    await waitFor(() => {
      const toggleButton = screen.getByTestId('docs-button');
      expect(toggleButton).toBeInTheDocument();

      fireEvent.click(toggleButton);
    });
  });

  it('updates input and variables state on change', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GraphiQLPage />
        </BrowserRouter>
      </Provider>,
    );

    const queryInput = screen.getByPlaceholderText(
      /query Query/,
    ) as HTMLTextAreaElement;
    const variablesInput = screen.getByPlaceholderText(
      'Query Variables',
    ) as HTMLTextAreaElement;

    fireEvent.change(queryInput, { target: { value: 'new query' } });
    fireEvent.change(variablesInput, { target: { value: 'new variables' } });

    expect(queryInput.value).toBe('new query');
    expect(variablesInput.value).toBe('new variables');
  });

  it('sends a GraphQL query and updates output state', async () => {
    window.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: { result: 'test result' } }),
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <GraphiQLPage />
        </BrowserRouter>
      </Provider>,
    );

    const playButton = screen.getByLabelText('Start');
    fireEvent.click(playButton);

    await waitFor(() => {
      expect(screen.getByText(/test result/)).toBeInTheDocument();
    });
  });

  it('toggles documentation view on button click', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GraphiQLPage />
        </BrowserRouter>
      </Provider>,
    );

    const apiInput = screen.getByPlaceholderText(
      'https://rickandmortyapi.com/graphql',
    );
    fireEvent.change(apiInput, {
      target: { value: 'https://newapi.com/graphql' },
    });

    const docsButton = screen.getByTestId('docs-button');
    fireEvent.click(docsButton);

    expect(screen.getByTestId('docs-content')).toBeInTheDocument();

    fireEvent.click(docsButton);

    expect(screen.queryByTestId('docs-content')).not.toBeInTheDocument();
  });

  it('saves the selected language in localStorage', async () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <GraphiQLPage />
        </BrowserRouter>
      </Provider>,
    );

    // Предположим, что у вас есть способ изменить язык в интерфейсе
    const languageSwitch = container.querySelector('.language-switch');
    if (languageSwitch) {
      fireEvent.click(languageSwitch);
    }

    expect(localStorage.setItem).toHaveBeenCalledWith('lang', 'en');
  });

  it('displays the documentation panel when the documentation button is clicked', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GraphiQLPage />
        </BrowserRouter>
      </Provider>,
    );

    const apiInput = screen.getByPlaceholderText(
      'https://rickandmortyapi.com/graphql',
    );
    fireEvent.change(apiInput, {
      target: { value: 'https://newapi.com/graphql' },
    });

    const docsButton = await screen.findByTestId('docs-button');
    await act(async () => {
      fireEvent.click(docsButton);
    });

    expect(screen.getByTestId('docs-content')).toBeInTheDocument();
  });

  it('hides the documentation panel when the documentation button is clicked again', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GraphiQLPage />
        </BrowserRouter>
      </Provider>,
    );

    const apiInput = screen.getByPlaceholderText(
      'https://rickandmortyapi.com/graphql',
    );
    fireEvent.change(apiInput, {
      target: { value: 'https://newapi.com/graphql' },
    });

    const docsButton = await screen.findByTestId('docs-button');
    await act(async () => {
      fireEvent.click(docsButton);
    });
    await act(async () => {
      fireEvent.click(docsButton);
    });

    expect(screen.queryByTestId('docs-content')).not.toBeInTheDocument();
  });

  it('updates headers and variables state on change', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GraphiQLPage />
        </BrowserRouter>
      </Provider>,
    );

    const headersInput = screen.getByPlaceholderText(
      'HTTP Headers',
    ) as HTMLInputElement;
    fireEvent.change(headersInput, { target: { value: 'new headers' } });

    expect(headersInput.value).toBe('new headers');

    const variablesInput = screen.getByPlaceholderText(
      'Query Variables',
    ) as HTMLTextAreaElement;
    fireEvent.change(variablesInput, { target: { value: 'new variables' } });

    expect(variablesInput.value).toBe('new variables');
  });
});
