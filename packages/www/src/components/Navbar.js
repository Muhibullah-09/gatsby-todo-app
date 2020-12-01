import React, { useContext } from "react";
import { Button, Flex, NavLink } from "theme-ui";
import { Link } from "gatsby";
import { IdentityContext } from "../../netlify-identity-context";

const Navbar = () => {
  const context = useContext(IdentityContext);
  const user = context.user;
  const netlifyIdentity = context.identity;
  return (
    <Flex as="nav">
      <NavLink as={Link} to="/" p={2}>
        Home
      </NavLink>
      {user && <NavLink as={Link} to="/app" p={2}>Dashboard</NavLink>}
      {user && (
        <NavLink  sx={{ cursor: 'pointer' }} p={2} onClick={() => netlifyIdentity.open()}>
          Logout {user.user_metadata.full_name}
        </NavLink>
      )}
    </Flex>
  );
};

export default Navbar;