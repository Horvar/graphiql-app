import React, { useState, useEffect } from 'react';
import {
  useLazyQuery,
  gql,
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
} from '@apollo/client';
import styles from './docs.module.css';

const SCHEMA_QUERY = gql`
  query IntrospectionQuery {
    __schema {
      queryType {
        name
      }
      mutationType {
        name
      }
      subscriptionType {
        name
      }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args {
          ...InputValue
        }
      }
    }
  }

  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }

  fragment InputValue on __InputValue {
    name
    description
    type {
      ...TypeRef
    }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

type GraphQLType = {
  kind: string;
  name: string;
  description: string;
  fields: {
    name: string;
    description: string;
    args: Array<{
      name: string;
      description: string;
      type: { name: string; kind: string };
      defaultValue: string;
    }>;
    type: { name: string; kind: string; ofType: { name: string } };
  }[];
};

type DocumentationProps = {
  url?: string;
};

const Documentation = (props: { url: string }) => {
  const [loadSchema, { called, loading, data }] = useLazyQuery(SCHEMA_QUERY);

  const [types, setTypes] = useState<GraphQLType[]>([]);
  const [queryName, setQueryName] = useState('');
  const [mutationName, setMutationName] = useState('');
  const [activeTypeName, setActiveTypeName] = useState<string>('');

  const [typeHistory, setTypeHistory] = useState<string[]>([]);

  const renderFields = () => {
    const type = types.find((type) => type.name === activeTypeName);

    if (!type || !type.fields) return <p>{type?.description}</p>;

    return (
      <>
        <h1 className={styles.title}>{type.name}</h1>
        <p>{type?.description}</p>
        {type.fields.map((field) => (
          <div key={field.name}>
            <span className={styles['field-name']}>{field.name} </span>
            <span
              className={styles['field-type']}
              onClick={() => {
                goToType(field.type.name ?? field.type.ofType.name);
              }}
            >
              : {field.type.name ?? `[${field.type.ofType.name}]`}
            </span>
          </div>
        ))}
      </>
    );
  };

  useEffect(() => {
    setActiveTypeName('');
    setTypeHistory([]);
  }, [props.url]);

  const goToType = (typeName: string) => {
    if (activeTypeName) setTypeHistory([...typeHistory, activeTypeName]);
    setActiveTypeName(typeName);
  };

  const goToPreviousType = () => {
    if (typeHistory.length === 0) {
      setActiveTypeName('');
      return;
    }

    const prevHistory = [...typeHistory];
    const prevTypeName = prevHistory.pop();
    setTypeHistory(prevHistory);
    setActiveTypeName(prevTypeName || '');
  };

  useEffect(() => {
    loadSchema();
  }, [loadSchema]);

  useEffect(() => {
    if (data && data.__schema) {
      setTypes(data.__schema.types);
      setQueryName(data.__schema.queryType.name);
      setMutationName(data.__schema?.mutationType?.name);
    } 
  }, [data]);

  if (!called || loading ) {
    return <p>Загрузка...</p>;
  }

  if (!data) {
    return <p>Error with fetching data. Please try again!</p>
  }

  return (
    <div>
      <h1 className={styles.title}>Документация схемы</h1>
      {typeHistory.length >= 0 && (
        <p onClick={goToPreviousType}>{typeHistory[typeHistory.length - 1]}</p>
      )}
      {typeHistory.length == 0 && activeTypeName && (
        <p onClick={goToPreviousType}>Docs</p>
      )}
      {activeTypeName ? (
        renderFields()
      ) : (
        <>
          {queryName && (
            <div>
              <span className={styles['field-name']}>Query </span>
              <span
                className={styles['field-type']}
                onClick={() => goToType(queryName)}
              >
                : Query
              </span>
            </div>
          )}
          {mutationName && (
            <div>
              <span className={styles['field-name']}>Mutation </span>
              <span
                className={styles['field-type']}
                onClick={() => goToType(mutationName)}
              >
                : Mutation
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const Docs: React.FC<DocumentationProps> = ({ url }) => {
  const client = new ApolloClient({
    uri: url,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      {url && <Documentation url={url} />}
    </ApolloProvider>
  );
};
