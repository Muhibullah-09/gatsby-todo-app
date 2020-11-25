import React, { useContext } from 'react'
import { Router } from '@reach/router'
import { IdentityContext } from '../../netlify-identity-context'
import { Flex, Heading, Button, Container } from 'theme-ui'
import Dashboard from '../components/Dashboard'
let DashLoggedOut = () => {
    const { user, identity: netlifyIdentity } = useContext(IdentityContext)
    return (
        <Container>
            <Flex sx={{ flexDirection: "column", padding: 3, textAlign: "center" }}>
                <Heading as="h1">Serverless Todo App</Heading>
                <Button
                    sx={{ marginTop: 2, color: 'black', fontFamily: 'monospace', cursor: 'pointer' }}
                    onClick={() => netlifyIdentity.open()}
                >
                    Add Todoist
                </Button>
            </Flex>
        </Container>
    )
}

export default props => {
    const { user } = useContext(IdentityContext)
    if (!user) {
        return (
            <Router >
                <DashLoggedOut path="/app/" />
            </Router>
        )
    }
    return (
        <Dashboard />
    )
}