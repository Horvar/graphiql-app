import styles from './GraphiQLPage.module.scss';

import icons from '../../assets/icons/sprite.svg';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { Docs } from './docs/docs';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { localizationType } from '../../types/localization';
import translationsEn from '../../localization/en.json';
import translationsRu from '../../localization/ru.json';

function GraphiQLPage() {
  const language = useSelector((state: RootState) => state.language.language);

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  const translations =
    language === 'en'
      ? (translationsEn as localizationType)
      : (translationsRu as localizationType);

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [api, setApi] = useState('');
  const [input, setInput] = useState(``);
  const [variables, setVariables] = useState('');
  const [headers, setHeaders] = useState('');
  const [output, setOutput] = useState({ data: null, error: null });
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const playgroundPlaceholder = `query Query {
    characters(page: 2, filter: {name: "Morty"}) {
      info {
        count
      }
      results {
        name
      }
    }
    location(id: 1) {
      id
    }
    episodesByIds(ids: [1, 2]) {
      id
    }
  }`;

  const makeRequest = (query: string, variables: string, headers: string) => {
    const variablesJson = variables ? JSON.parse(variables) : {};
    const headersJson = headers ? JSON.parse(headers) : {};
    return fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headersJson },
      body: JSON.stringify({ query, variables: variablesJson }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOutput({ data: data, error: null });
      })
      .catch((error) => {
        console.error('Request Error:', error);
        setOutput({ data: null, error: error.message });
      });
  };

  const onHandlerQuery = () => {
    makeRequest(input, variables, headers);
    onPrettifyQuery();
  };

  const handlerChangeApi = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApi(event.target.value);
  };

  function prettifyQuery(query: string): string {
    const lines = query.split('\n');
    const prettifiedQuery: string[] = [];
    let indentLevel = 0;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine === '') return;

      if (trimmedLine.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      prettifiedQuery.push('  '.repeat(indentLevel) + trimmedLine);

      if (trimmedLine.endsWith('{')) {
        indentLevel++;
      }
    });

    return prettifiedQuery.join('\n');
  }

  const onPrettifyQuery = (): void => {
    const prettifiedQuery = prettifyQuery(input);
    const prettifiedHeaders = prettifyQuery(headers);
    const prettifiedVariables = prettifyQuery(variables);
    setInput(prettifiedQuery);
    setHeaders(prettifiedHeaders);
    setVariables(prettifiedVariables);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) navigate('/login');
  }, [user, loading]);

  return (
    <section className={styles.playground}>
      <div className={`${styles.playgroundContainer} container container`}>
        <h1 className={`${styles.playgroundTitle} title-1`}>
          {translations.graphQL.title}
        </h1>

        <div className={styles.playgroundInputWrapper}>
          <input
            className={styles.playgroundInput}
            type="text"
            value={api}
            placeholder="https://rickandmortyapi.com/graphql"
            onChange={handlerChangeApi}
          />
          {api && (
            <button
              type="button"
              aria-label="Documentation"
              data-testid="docs-button"
              className={`${styles.playgroundButton} ${
                styles.playgroundButtonDocs
              } ${isDocsOpen ? styles.active : ''}`}
              onClick={() => setIsDocsOpen(!isDocsOpen)}
            >
              <svg className={styles.playgroundIcon}>
                <use href={`${icons}#docs`}></use>
              </svg>
            </button>
          )}
        </div>

        {isDocsOpen && (
          <div className={styles.playgroundRow}>
            <div className={styles.playgroundDocs} data-testid="docs-content">
              <Docs url={api} />
            </div>
          </div>
        )}

        <div className={styles.playgroundRow}>
          <div className={styles.playgroundColLeft}>
            <textarea
              className={styles.playgroundTextarea}
              value={input}
              placeholder={playgroundPlaceholder}
              onChange={(event) => {
                setInput(event.target.value);
              }}
            />
          </div>

          <div className={styles.playgroundColCenter}>
            <button
              type="button"
              aria-label="Start"
              className={styles.playgroundButton}
              data-testid="start-button"
              onClick={onHandlerQuery}
            >
              <svg className={styles.playgroundIcon}>
                <use href={`${icons}#play`}></use>
              </svg>
            </button>
          </div>

          <div className={styles.playgroundColRight}>
            <pre className={styles.playgroundOutput}>
              {output.error ? (
                <div
                  className={styles.playgroundError}
                >{`Error: ${output.error}`}</div>
              ) : output.data !== null ? (
                JSON.stringify(output.data, null, 2)
              ) : (
                ''
              )}
            </pre>
          </div>
        </div>

        <div className={styles.playgroundRow}>
          <div className={styles.playgroundColLeft}>
            <div className={styles.playgroundRow}>
              <div className={styles.playgroundToggle}>
                <input
                  id="checkboxVariables"
                  type="checkbox"
                  className={styles.playgroundToggleCheckbox}
                />
                <label
                  htmlFor="checkboxVariables"
                  className={styles.playgroundToggleLabel}
                >
                  <span>Query Variables</span>
                  <svg className={styles.playgroundToggleIcon}>
                    <use href={`${icons}#chevron`}></use>
                  </svg>
                </label>
                <textarea
                  className={styles.playgroundSubEditor}
                  placeholder="Query Variables"
                  value={variables}
                  onChange={(event) => setVariables(event.target.value)}
                />
              </div>
              <div className={styles.playgroundToggle}>
                <input
                  id="checkboxHeaders"
                  type="checkbox"
                  className={styles.playgroundToggleCheckbox}
                />
                <label
                  htmlFor="checkboxHeaders"
                  className={styles.playgroundToggleLabel}
                >
                  <span>HTTP Headers</span>
                  <svg className={styles.playgroundToggleIcon}>
                    <use href={`${icons}#chevron`}></use>
                  </svg>
                </label>
                <textarea
                  className={styles.playgroundSubEditor}
                  placeholder="HTTP Headers"
                  value={headers}
                  onChange={(event) => setHeaders(event.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={styles.playgroundColCenter}></div>
          <div className={styles.playgroundColRight}></div>
        </div>
      </div>
    </section>
  );
}

export default GraphiQLPage;
