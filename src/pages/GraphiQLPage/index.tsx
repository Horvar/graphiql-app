import { useState } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { IntrospectionQuery } from 'graphql';
import styles from './GraphiQLPage.module.scss';

function GraphiQLPage() {
  const [api, setApi] = useState('https://rickandmortyapi.com/graphql');
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

  const [schema, setSchema] = useState<IntrospectionQuery[]>([]);

  const url = 'https://rickandmortyapi.com/graphql';

  const makeRequest = (query: any) => {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }).then((response) => response.json());
  };

  const onHandlerQuery = () => {
    makeRequest(input).then(
      // (result) => console.log('result', result.data.characters.results),
      (result) => setOutput(result.data.characters.results),
    );
  };

  const [open, setOpen] = useState(false);

  const onOpenDocs = () => {
    const client = new ApolloClient({
      uri: url, // Замените на URL вашего GraphQL-сервера
      cache: new InMemoryCache(),
    });

    client
      .query({
        query: gql`
          query GetSchema {
            __schema {
              types {
                name
                kind
                description
                fields {
                  name
                  description
                  type {
                    name
                    kind
                  }
                }
              }
            }
          }
        `,
      })
      .then((result) => {
        const schema = result.data.__schema;

        const schemaResult = [];
        schema.types.forEach((type) => {
          console.log(`Тип: ${type.name}, Kind: ${type.kind}`);
          if (type.fields) {
            console.log('Поля:');
            type.fields.forEach((field) => {
              console.log(
                `  Имя поля: ${field.name}, Описание: ${
                  field.description || 'Нет описания'
                }, Тип: ${field.type.name}`,
              );
              schemaResult.push({
                name: field.name,
                description: field.description || 'Нет описания',
                type: field.type.name,
              });
            });
          }
        });
        setSchema(schemaResult);
      })
      .catch((error) => {
        console.error('Ошибка при получении схемы:', error);
      });
    setOpen(!open);
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
        <button className={styles.docsButton} onClick={onOpenDocs}>
          Docs
        </button>
        <div
          className={styles.docsWrapper}
          style={{ display: `${open ? 'block' : 'none'}` }}
        >
          {schema.map((item) => (
            <div className={styles.docsContent} key={item.Name}>
              <p>{item.name}</p>
              <p> - {item.description}</p>
              <p> - {item.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GraphiQLPage;
