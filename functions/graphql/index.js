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