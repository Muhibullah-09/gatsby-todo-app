import React, { useContext } from 'react'
import {Router} from '@reach/router'
import {IdentityContext} from '../../netlify-identity-context'
import {Flex, Heading, Button, Container} from 'theme-ui'
import Dashboard from '../components/Dashboard'
let DashLoggedOut = ()=> {
    const {user, identity:netlifyIdentity} = useContext(IdentityContext)
    return (
        <Container>       
            <Flex sx={{flexDirection:"column", margin:"auto"}} pt={6}>
                <Heading as="h1" p={4} sx={{margin:"auto"}}>Wellcome to Serverless Todo App</Heading>
                <Button 
                    sx={{marginTop:2, color:"black", margin:"auto"}}
                    onClick={()=>netlifyIdentity.open()}
                    >
                        Login To Create Todos
                </Button>
            </Flex>
    </Container>
    )}

export default props =>{
    const {user} = useContext(IdentityContext)
    if(!user){
        return (
            <Router >
                <DashLoggedOut path="/app/" />
            </Router>
        )
    }
    return (
        <Dashboard/>
    )
}