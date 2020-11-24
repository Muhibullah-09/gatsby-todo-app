const React = require('react');
const wrapRootElement = require('./wrap-root-element')
const {ApolloClient,ApolloProvider,InMemoryCache,HttpLink} = require('@apollo/client')
const {setContext} = require('apollo-link-context')
const netlifyIdentity= require('netlify-identity-widget')
//seting Apollo client
const authLink= setContext((_,{headers})=>{
    const user = netlifyIdentity.currentUser()
    const token = user.token.access_token
    return {
        headers:{
            ...headers,
            Authorization: token ? `Bearer ${token}`: ""
        }
    }
})
const httpLink = new HttpLink({
    uri: "https://muhibullahkhan-todoapp.netlify.app/.netlify/functions/graphql"
})
export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
})