import React, { useContext, useEffect, useRef, useState } from "react";
import { Router } from "@reach/router";
import { IdentityContext } from "../../netlify-identity-context";
import Navbar from "../components/Navbar";
import { Box, Button, Container, Flex, Heading, Input, Label, NavLink } from "theme-ui";
import { gql, useMutation, useQuery } from "@apollo/client";
import Todo from "../components/Todo";
import { Link } from "gatsby";

const GET_TODOS_BY_USER = gql`
  query Test($email: String!) {
    todosByEmail(email: $email) {
      content
      completed
    }
  }
`;

const UPDATE_TODOS = gql`
  mutation test2($email: String!, $todos: [TodoInput]) {
    updateTodos(email: $email, todos: $todos) {
      email
      todos {
        content
        completed
      }
    }
  }
`;

const Dash = () => {
    const [todos, setTodos] = useState([]);
    const todoRef = useRef(null);
    const context = useContext(IdentityContext);
    const user = context.user;
    const { data, loading } = useQuery(GET_TODOS_BY_USER, {
        variables: { email: user.email },
    });
    const [updateTodos] = useMutation(UPDATE_TODOS);

    useEffect(() => {
        if (data) {
            setTodos(data?.todosByEmail);
        }
    }, [data]);

    useEffect(() => {
        updateTodos({
            variables: {
                email: user.email,
                todos,
            },
        });
    }, [todos]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTodos(
            todos.concat({
                content: todoRef.current.value,
                completed: false,
            })
        );
        await updateTodos({
            variables: {
                email: user.email,
                todos: todos.concat({
                    content: todoRef.current.value,
                    completed: false,
                }),
            },
        });
        todoRef.current.value = "";
    };
    const handleTodoChange = (i) => {
        setTodos((todos) =>
            todos.map((t, idx) => {
                return i === idx ? { content: t.content, completed: !t.completed } : t;
            })
        );
    };

    return (
        <div>
            <Container>
                <Navbar />
                <Heading as="h3" sx={{ textAlign: "center" }}>Make Schedule Easy</Heading>
                <Box as="form" onSubmit={handleSubmit}>
                    <Label
                        htmlFor="todo"
                        sx={{ fontSize: "2rem", color: "white", fontWeight: "bold" }}
                    >
                        Add Todo
                    </Label>
                    <Flex>
                        <Input name="todo" id="todo" ref={todoRef} />
                        <Button sx={{ color: "black" }}>Submit</Button>
                    </Flex>
                </Box>
                {todos?.map((t, i) => {
                    return <Todo key={i} todo={t} onChange={() => handleTodoChange(i)} />;
                })}
                {loading && <Heading as="h3" sx={{ textAlign: "center" }}>Loading...</Heading>}
            </Container>
        </div>
    );
};

const App = () => {
    const context = useContext(IdentityContext);
    const user = context.user;
    return (<>
        <Router>{user && <Dash path="/app" />}</Router>
        {!user && <NavLink as={Link} to="/" p={2}>Home</NavLink>}
    </>)
};

export default App;