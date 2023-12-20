import React, { useState, useEffect } from 'react';
import {
  useLazyQuery,
  gql,
  InMemoryCache,
  ApolloClient,
  ApolloProvider,
} from '@apollo/client';

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
        kind
        name
        description
        fields(includeDeprecated: true) {
          name
          description
          args {
            name
            description
            type {
              name
              kind
            }
            defaultValue
          }
          type {
            name
            kind
          }
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
        }
        possibleTypes {
          ...TypeRef
        }
      }
    }
  }

  fragment InputValue on __InputValue {
    name
    description
    type {
      name
      kind
      ofType {
        name
      }
    }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      name
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
    type: { name: string; kind: string };
  }[];
};

type DocumentationProps = {
  url?: string;
};

const Documentation = () => {
  const [loadSchema, { called, loading, data }] = useLazyQuery(SCHEMA_QUERY);
  const [types, setTypes] = useState<GraphQLType[]>([]);
  console.log(types)
  console.log(types.filter((type) => {
    if (type.name === 'Character') {
      return type
    }
  }))

  useEffect(() => {
    loadSchema();
  }, [loadSchema]);

  useEffect(() => {
    if (data && data.__schema) {
      setTypes(data.__schema.types);
    }
  }, [data]);

  if (!called || loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h1>Документация схемы</h1>
      {types.map((type) => (
        <div key={type.name}>
          <h2>{type.name}</h2>
          <p>{type.description}</p>
          {type.fields && (
            <div>
              <h3>Поля</h3>
              {type.fields.map((field) => (
                <div key={field.name}>
                  <h4>{field.name}</h4>
                  <p>{field.description}</p>
                  {field.args && (
                    <ul>
                      {field.args.map((arg) => (
                        <li key={arg.name}>
                          <strong>{arg.name}</strong>: ({arg.type.name}){' '}
                          {arg.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const Docs: React.FC<DocumentationProps> = ({
  url = 'https://rickandmortyapi.com/graphql',
}) => {
  const client = new ApolloClient({
    uri: url,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Documentation />
    </ApolloProvider>
  );
};
