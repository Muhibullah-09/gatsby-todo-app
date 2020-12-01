import React, { useContext } from "react";
import { Button, Container, Flex, Heading } from "theme-ui";
import { IdentityContext } from "../../netlify-identity-context";
import Navbar from "../components/Navbar";
import { Link } from "gatsby";

const Index = () => {
  const context = useContext(IdentityContext);
  const user = context.user;
  const netlifyIdentity = context.identity;
  return (
    <Container>
      <Navbar />
      <Flex sx={{ flexDirection: "column", padding: 3, textAlign: "center" }}>
        <Heading as="h1">Todo App</Heading>
        {!user && (
          <Button
            sx={{ marginTop: 2, color: 'black', fontFamily: 'monospace', cursor: 'pointer' }}
            onClick={() => {
              netlifyIdentity.open();
            }}
          >
            Login
          </Button>
        )}
        {user && (
            <Button sx={{ marginTop: 2, color: 'black', cursor: 'pointer' }}>
              <Link to='app/'>Create Todos</Link>
            </Button>
        )}
      </Flex>
    </Container>
  );
};

export default Index;