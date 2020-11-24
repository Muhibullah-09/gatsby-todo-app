module.exports={
    plugins:[
        {
      resolve: [`gatsby-plugin-create-client-paths`,`gatsby-plugin-apollo`],
      options: { prefixes: [`/app/*`] },
    },
    `gatsby-plugin-fontawesome-css`
    ]
}