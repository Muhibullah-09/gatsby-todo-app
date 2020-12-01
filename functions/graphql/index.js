// const { ApolloServer, gql } = require('apollo-server-lambda')
// const faunadb = require('faunadb');
// const q = faunadb.query;


// // construct schema using glq

// const typeDefs = gql`
//     type Query {
//         todos: [Todo!]
//     }
//     type Todo {
//         id: ID!
//         text: String!
//         done: Boolean!
//     }
//     type Mutation {
//         addTodo(text:String!): Todo!
//         updateTodoDone(id:ID!, done: Boolean): Todo
//         deleteTodo(id:ID!): Todo
//     }
// `

// // resolver function fro schema
// const resolvers = {
//     Query: {
//         todos: async (parent, args, { user }) => {
//             try {
//                 const client = new faunadb.Client({ secret: "fnAD7YOU2wACBWl8iQcLTPa6F5S3_OAC6vZbY9B9" })
//                 const results = await client.query(
//                     q.Map(
//                         q.Paginate(q.Match(q.Index("todolist"))),
//                         q.Lambda("X", query.Get(query.Var("X")))
//                     )
//                 );
//                 console.log(
//                     "Result : ",
//                     result.data.map((d) => {
//                         return {
//                             id: d.ref.id,
//                             task: d.data.task,
//                             done: d.data.done,
//                         };
//                     })
//                 );
//                 return result.data.map((d) => {
//                     return {
//                         id: d.ref.id,
//                         task: d.data.task,
//                         done: d.data.done,
//                     };
//                 });
//             } catch (error) {
//                 console.log("ERROR : ", error);
//             }
//         },
//     },

//     Mutation: {
//         addTodo: async (_, { text }, { user }) => {
//             try {
//                 const client = new faunadb.Client({ secret: "fnAD7YOU2wACBWl8iQcLTPa6F5S3_OAC6vZbY9B9" })
//                 const data = await client.query(
//                     q.Create(q.Collection("list"), {
//                         data: {
//                             text: task,
//                             done: false,
//                         }
//                     })
//                 );
//                 console.log('Data :', data);
//                 return {
//                     id: data.ref.id,
//                     task: data.data.task,
//                     done: data.data.done,
//                 }
//             }
//             catch (err) {
//                 console.log("err", err)
//             }
//         },
//         updateTodoDone: async (_, { id, done }) => {
//             try {
//                 const client = new faunadb.Client({ secret: "fnAD7YOU2wACBWl8iQcLTPa6F5S3_OAC6vZbY9B9" })
//                 const data = await client.query(
//                     q.Update(q.Ref(q.Collection('list'), id), {
//                         data: {
//                             done: done
//                         }
//                     })
//                 );
//                 console.log('Data :', data)
//                 return {
//                     id: data.ref.id,
//                     task: data.data.task,
//                     done: data.data.done,
//                 };
//             }
//             catch (err) {
//                 console.log("err", err)
//             }
//         },
//         deleteTodo: async (_, { id }) => {
//             try {
//                 // if (!user) {
//                 //     throw new Error("Must be authenticated to delete todos")
//                 // }
//                 const client = new faunadb.Client({ secret: "fnAD7YOU2wACBWl8iQcLTPa6F5S3_OAC6vZbY9B9" })
//                 const data = await client.query(
//                     q.Delete(q.Ref(q.Collection('list'), id))
//                 );
//                 console.log("Data : ", data);
//                 return {
//                     id: data.ref.id,
//                     task: data.data.task,
//                     done: data.data.done,
//                 };
//             }
//             catch (err) {
//                 console.log("err", err)
//             }
//         },
//     },
// }

// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
// });

// const handler = server.createHandler();

// module.exports = { handler };
const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");
const q = faunadb.query;

const typeDefs = gql`
  type Query {
    todosByEmail(email: String!): [Todo!]
  }
  type Todo {
    content: String!
    completed: Boolean!
  }
  input TodoInput {
    content: String!
    completed: Boolean!
  }
  type User {
    email: String!
    todos: [Todo!]
  }
  type Mutation {
    updateTodos(email: String!, todos: [TodoInput]): User
  }
`;


const resolvers = {
    Query: {
        todosByEmail: async (_, args) => {
            const client = new faunadb.Client({
                secret: "fnAD7YOU2wACBWl8iQcLTPa6F5S3_OAC6vZbY9B9",
            });
            try {
                // User found
                const result = await client.query(
                    q.Get(q.Match(q.Index("todolist"), args.email))
                );
                console.log(args, result);
                return result.data.todos;
            } catch (error) {
                console.log(error);
                // user not found
                await client.query(
                    q.Create(q.Collection("list"), {
                        data: { email: args.email, todos: [] },
                    })
                );
                return [];
            }
        },
    },
    Mutation: {
        updateTodos: async (_, args) => {
            const client = new faunadb.Client({
                secret: "fnAD7YOU2wACBWl8iQcLTPa6F5S3_OAC6vZbY9B9",
            });
            await client.query(
                q.Update(
                    q.Select(
                        "ref",
                        q.Get(q.Match(q.Index("todolist"), args.email))
                    ),
                    { data: { todos: args.todos } }
                )
            );
            const a = await client.query(
                q.Get(q.Match(q.Index("todolist"), args.email))
            );
            return a.data;
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const handler = server.createHandler();

module.exports = { handler };