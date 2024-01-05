import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Component without errors</div>;
};

describe('ErrorBoundary', () => {
  let originalConsoleError: typeof console.error;

  beforeAll(() => {
    originalConsoleError = console.error;
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('displays an error message when a child component throws an error', () => {
    console.error = jest.fn();

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText('Unexpected Error Encountered'),
    ).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    console.error = originalConsoleError;
  });

  it('does not crash on empty rendering', () => {
    render(
      <ErrorBoundary>
        <></>
      </ErrorBoundary>,
    );
  });
});
