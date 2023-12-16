import { useState } from 'react';

import styles from './GraphiQLPage.module.scss';
import { Docs } from './docs/docs';

function GraphiQLPage() {
  const [api, setApi] = useState('https://rickandmortyapi.com/graphql');
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const url = 'https://rickandmortyapi.com/graphql';

  const [input, setInput] = useState(`query Query {
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
  }`);
  const [output, setOutput] = useState([]);

  const makeRequest = (query: any) => {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }).then((response) => response.json());
  };

  const onHandlerQuery = () => {
    makeRequest(input).then((result) =>
      setOutput(result.data.characters.results),
    );
  };

  const handlerChangeApi = (event: any) => {
    setApi(event.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.titleTest}>Страница GraphiQL</h1>

      <div>
        <input
          className={styles.apiInput}
          type="text"
          value={api}
          onChange={() => {
            handlerChangeApi;
          }}
        />
        <button
          className={styles.apiButton}
          onClick={() => {
            console.log(api);
          }}
        >
          Submit
        </button>
      </div>

      <div className={styles.inputOutputWrapper}>
        <textarea
          className={styles.input}
          name=""
          id=""
          cols="30"
          rows="10"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        <button className={styles.graphButton} onClick={onHandlerQuery}>
          {'>'}
        </button>
        <div className={styles.output}>
          {output.map((item, index) => (
            <div key={index}>{item.name}</div>
          ))}
        </div>
        <button
          className={styles.docsButton}
          onClick={() => setIsDocsOpen(!isDocsOpen)}
        >
          Docs
        </button>
        <Docs isDocsOpen={isDocsOpen} url={url} />
      </div>
    </div>
  );
}

export default GraphiQLPage;
