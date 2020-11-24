module.exports={
    plugins:[
        {
      resolve: [`gatsby-plugin-create-client-paths`,`gatsby-plugin-apollo`],
      options: { prefixes: [`/app/*`] , uri: "https://muhibullahkhan-todoapp.netlify.app/.netlify/functions/graphql"},
    },
    `gatsby-plugin-fontawesome-css`
    ]
}