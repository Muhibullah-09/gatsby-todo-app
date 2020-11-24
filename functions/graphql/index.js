const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb')
const q = faunadb.query


// construct schema using glq

const typeDefs = gql`
    type Query {
        todos: [Todo!]
    }
    type Todo {
        id: ID!
        text: String!
        done: Boolean!
    }
    type Mutation {
        addTodo(text:String!): Todo
        updateTodoDone(id:ID!): Todo
        deleteTodo(id:ID!): Todo
    }
`

// resolver function fro schema
const resolvers = {
    Query: {
        todos: async (parent, args, { user }) => {
            try {
                if (!user) {
                    return []
                } else {
                    const client = new faunadb.Client({ secret: "fnAD7YOU2wACBWl8iQcLTPa6F5S3_OAC6vZbY9B9" })
                    const results = await client.query(
                        q.Map(
                            q.Paginate(q.Match(q.Index("todolist"))),
                            q.Lambda(x => q.Get(x))
                        )
                    )
                    return results.data.map(d => {
                        return {
                            id: d.ts,
                            text: d.data.text,
                            done: d.data.done
                        }
                    })
                }
            }
            catch (err) {
                console.log("err", err);
            }
        }
    },

    Mutation: {
        addTodo: async (_, { text }, { user }) => {
            try {
                if (!user) {
                    throw new Error("Must be authenticated to add todos")
                }
                const client = new faunadb.Client({ secret: "fnAD7YOU2wACBWl8iQcLTPa6F5S3_OAC6vZbY9B9" })
                const results = await client.query(
                    q.Create(q.Collection("list"), {
                        data: {
                            text,
                            done: false,
                            owner: user
                        }
                    })
                )
                return {
                    ...results.data,
                    id: results.ref.id
                }
            }
            catch (err) {
                console.log("err", err)
            }
        },
        updateTodoDone: async (_, { id }, { user }) => {
            try {
                if (!user) {
                    throw new Error("Must be authenticated to add todos")
                }
                const client = new faunadb.Client({ secret: "fnAD7YOU2wACBWl8iQcLTPa6F5S3_OAC6vZbY9B9" })
                const results = await client.query(
                    q.Update(q.Ref(q.Collection('list'), id), {
                        data: {
                            done: true
                        }
                    })
                )
                return {
                    ...results.data,
                    id: results.ref.id
                }
            }
            catch (err) {
                console.log("err", err)
            }
        },
        deleteTodo: async (_, { id }, { user }) => {
            try {
                if (!user) {
                    throw new Error("Must be authenticated to delete todos")
                }
                const client = new faunadb.Client({ secret: "fnAD7YOU2wACBWl8iQcLTPa6F5S3_OAC6vZbY9B9" })
                const results = await client.query(
                    q.Delete(q.Ref(q.Collection('list'), id))
                )
            }
            catch (err) {
                console.log("err", err)
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ context }) => {
        if (context.clientContext.user) {

            return { user: context.clientContext.user.sub }
        }
        else {
            return {}
        }
    }
})
exports.handler = server.createHandler({
    cors: {
        origin: "*",
        credentials: true
    }
})
