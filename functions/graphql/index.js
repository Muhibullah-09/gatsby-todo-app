const {ApolloServer, gql} = require('apollo-server-lambda')
const faunadb=require('faunadb')
const q = faunadb.query

const client = new faunadb.Client({secret:process.env.FAUNADB_ADMIN_SECRET})

// construct schema using glq

const typeDefs= gql`
type Query{
    todos:[Todo]!
}
type Todo{
    id: ID!
    text: String!
    done: Boolean!
}
type Mutation{
    addTodo(text:String!):Todo
    updateTodoDone(id:ID!):Todo
    deleteTodo(id:ID!):Todo
}
`;

// resolver function fro schema
const resolvers = {
    Query:{
        todos:async(parent,args,{user})=> {
            if(!user){
                return []
            }else{
                const results = await client.query(
                    q.Paginate(q.Match(q.Index("todos_by_owner"), user))
                );
                return results.data.map(([ref,text,done])=>{
                    return {
                        id:ref.id,
                        text,
                        done
                    }
                })
            }
    }},
    Mutation:{
        addTodo:async(_,{text},{user})=>{
            if(!user){
                throw new Error("Must be authenticated to add todos")
            }
            const results = await client.query(
                q.Create(q.Collection("todos"),{
                    data:{
                        text,
                        done:false,
                        owner:user
                    }
                })
            )
            return {
                ...results.data,
                id: results.ref.id
            }
        },
        updateTodoDone:async(_,{id}, { user })=>{
            if(!user){
                throw new Error("Must be authenticated to add todos")
            }
            const results= await client.query(
                q.Update(q.Ref(q.Collection('todos'),id),{
                    data:{
                        done:true
                    }
                })
            )
            return {
                ...results.data,
                id: results.ref.id
            }
        },
        deleteTodo: async(_,{id}, {user})=>{
            if(!user){
                throw new Error("Must be authenticated to delete todos")
            }
            const results = await client.query(
                q.Delete(q.Ref(q.Collection('todos'),id))
            )
            
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({context})=>{
        if(context.clientContext.user){

            return {user: context.clientContext.user.sub}
        }
        else{
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
