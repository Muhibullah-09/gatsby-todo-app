import React from 'react';
import { ApolloProvider, from } from '@apollo/client';
import { client } from './client';
import { Provider } from '../../netlify-identity-context';
export const wrapRootElement = ({ element }) => (
    <Provider>

        <ApolloProvider client={client}>{element}</ApolloProvider>
        
    </Provider>
);