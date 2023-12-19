import React, { Component, ReactNode } from 'react';

import styles from './ErrorBoundary.module.scss';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <section className={styles.errorBoundary}>
            <div
              className={`${styles.errorBoundaryContainer} container container--small`}
            >
              <h1 className={`${styles.errorBoundaryTitle} title-1`}>
                Unexpected Error Encountered
              </h1>
              <div className={`${styles.errorBoundaryText} text-common`}>
                {this.state.error?.message}
              </div>
              <button
                className={styles.errorBoundaryButton}
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
            </div>
          </section>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
