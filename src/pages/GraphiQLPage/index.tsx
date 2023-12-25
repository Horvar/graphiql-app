import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { Docs } from './docs/docs';
import styles from './GraphiQLPage.module.scss';

function GraphiQLPage() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [api, setApi] = useState('');
  const [input, setInput] = useState(``);
  const [variables, setVariables] = useState('');
  const [headers, setHeaders] = useState('');
  const [output, setOutput] = useState('');
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
        setOutput(JSON.stringify(data, null, 2));
      })
      .catch((error) => {
        console.error('Ошибка запроса:', error);
        setOutput(`Ошибка: ${error}`);
      });
  };

  const onHandlerQuery = () => {
    makeRequest(input, variables, headers);
  };

  const handlerChangeApi = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApi(event.target.value);
  };

  useEffect(() => {
    if (loading) return;
    if (!user) navigate('/login');
  }, [user, loading]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.titleTest}>Страница GraphiQL</h1>
      <div>
        <input
          className={styles.apiInput}
          type="text"
          value={api}
          placeholder="https://rickandmortyapi.com/graphql"
          onChange={handlerChangeApi}
        />
      </div>

      <div className={styles.inputOutputWrapper}>
        <div className={styles.textareaWrapper}>
          <textarea
            className={styles.input}
            name=""
            id=""
            cols={20}
            rows={10}
            value={input}
            placeholder={playgroundPlaceholder}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
          <div className={styles.textareaVariablesAndHeader}>
            <textarea
              className={styles.variablesInput}
              cols={5}
              rows={10}
              placeholder="QUERY VARIABLES"
              value={variables}
              onChange={(event) => setVariables(event.target.value)}
            />
            <textarea
              className={styles.headersInput}
              cols={5}
              rows={10}
              placeholder="HTTP HEADERS"
              value={headers}
              onChange={(event) => setHeaders(event.target.value)}
            />
          </div>
        </div>
        <button className={styles.graphButton} onClick={onHandlerQuery}>
          {'>'}
        </button>
        <pre className={styles.output}>{output}</pre>
        {api && (
          <button
            className={styles.docsButton}
            onClick={() => setIsDocsOpen(!isDocsOpen)}
          >
            Docs
          </button>
        )}
        {isDocsOpen && <Docs url={api} />}
      </div>
    </div>
  );
}

export default GraphiQLPage;
