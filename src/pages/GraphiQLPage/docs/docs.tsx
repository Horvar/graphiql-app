// import { useEffect, useState } from 'react';
// import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
// import { IntrospectionQuery } from 'graphql';
// import styles from './docs.module.css';

// type Props = {
//   isDocsOpen: boolean;
//   url: string;
// };

// export const Docs = ({ isDocsOpen, url }: Props) => {
//   const [open, setOpen] = useState(false);
//   const [schema, setSchema] = useState<IntrospectionQuery[]>([]);

//   const displayDocs = () => {
//     const client = new ApolloClient({
//       uri: url,
//       cache: new InMemoryCache(),
//     });

//     client
//       .query({
//         query: gql`
//           query GetSchema {
//             __schema {
//               types {
//                 name
//                 kind
//                 description
//                 fields {
//                   name
//                   description
//                   type {
//                     name
//                     kind
//                   }
//                 }
//               }
//             }
//           }
//         `,
//       })
//       .then((result) => {
//         const schema = result.data.__schema;

//         const schemaResult = [];
//         schema.types.forEach((type) => {
//           if (type.fields) {
//             type.fields.forEach((field) => {
//               schemaResult.push({
//                 name: field.name,
//                 description: field.description || 'Нет описания',
//                 type: field.type.name,
//               });
//             });
//           }
//         });
//         setSchema(schemaResult);
//       })
//       .catch((error) => {
//         console.error('Ошибка при получении схемы:', error);
//       });
//     setOpen(!open);
//   };

//   useEffect(() => {
//     displayDocs();
//   }, []);

//   return (
//     <div className={isDocsOpen ? styles.docsWrapper : styles.docsWrapperClose}>
//       {schema.map((item, index) => (
//         <div className={styles.docsContent} key={index}>
//           <p>{item.name}</p>
//           <p>-{item.description}</p>
//           <p>-{item.type}</p>
//         </div>
//       ))}
//     </div>
//   );
// };
