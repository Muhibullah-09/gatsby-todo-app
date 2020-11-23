//The file gatsby-browser.js lets you respond to actions within the browser, and wrap your site in additional components. The Gatsby Browser API gives you many options for interacting with the client-side of Gatsby.
const React = require('react');
const wrapRootElement = require('./wrape-root-element')
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
    uri: "https://mahmood-project-12c.netlify.app/.netlify/functions/graphql"
})
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
})

exports.wrapRootElement=({element})=>{
    return(
        <ApolloProvider client={client}>
            {wrapRootElement({element})}           
        </ApolloProvider>
    )
}