import React, { useRef, useContext } from 'react'
import { Link} from '@reach/router'
import {IdentityContext} from '../../netlify-identity-context'
import {Flex, Container, NavLink, Input, Button,Label, Checkbox, Heading} from 'theme-ui'
import {gql, useMutation, useQuery} from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'


// Graphql queries
const ADD_TODO =gql`
    mutation($text:String!){
        addTodo(text:$text){
            id
        }
    }
`;
const UPDATE_TODO_DONE = gql`
    mutation UpdateTodoDone($id: ID!){
        updateTodoDone(id:$id){
            text
            done
        }
    }
`; 
const DELETE_TODO=gql`
    mutation DeleteTodo($id:ID!){
        deleteTodo(id:$id){
            text
        }
    }
`;
const GET_TODOS=gql`
    query GetTods{
        todos{
            id
            text
            done
        }
    }
`;


export default  ()=>{
    const {user, identity:netlifyIdentity} = useContext(IdentityContext)
    const inputRef = useRef()
    const [addTodo]= useMutation(ADD_TODO)
    const [deleteTodo]= useMutation(DELETE_TODO)
    const [updateTodoDone ] = useMutation(UPDATE_TODO_DONE)
    const {loading,error,data,refetch} = useQuery(GET_TODOS)
    console.log(data)
    return (
        <Container>
            <Flex as="nav">
                <NavLink as={Link} to="/" p={4}> Home</NavLink>
                <NavLink as={Link} to="/app" p={4}> Dashboard</NavLink>
                {user && (
                    <NavLink 
                    href="#!" p={4}
                    onClick={()=>{
                        netlifyIdentity.logout()
                    }}
                    >
                      Logout  {user && user.user_metadata.full_name} 
                    </NavLink>
                )}
            </Flex>
            <Flex sx={{margin:"auto"}}>
                <Heading as="h1" sx={{margin:"auto",color:"white",fontFamily:"system-ui"}} p={5}>Wellcome to Serverless Todos App</Heading>
            </Flex>
            <Flex pl={6} pr={6} as="form" onSubmit={async e=>{
                e.preventDefault()
                await addTodo({variables:{text:inputRef.current.value}})
                await refetch()
                inputRef.current.value=""
            }}>
                <Label sx={{display:"flex",fontFamily:"system-ui"}}>
                    <span sx={{marginLeft:1,background:"#3E38F2"}}>Add todo</span>
                    <Input ref={inputRef} sx={{marginLeft:1}} mr={2} />
                </Label>
                
                <Button sx={{marginLeft:1,background:"#3E38F2"}}>Submit</Button>
            </Flex>
            <Flex 
            sx={{flexDirection:"column"}} pt={5}

            >
                {loading ? (<div>Loading...</div>):null}
                {error ? (<div>{error.message}</div>):null}
                {!loading && !error && (
                <ul sx={{listStyleType:"none"}}>
                    {data.todos.map((todo) =>(
                        <Flex as="li" p={2}
                            sx={{ fontSize:"22px",alignItems: "flex-end"}}
                            key={todo.id}
                            onClick={async()=>{
                                await updateTodoDone({variables:{id: todo.id}})
                                await refetch()
                                
                            }}
                            
                        >
                            <Checkbox checked={todo.done}/>
                            <Flex pl={2}sx={{justifyContent:"space-between",width:"100%"}}>
                                <span>{todo.text}</span>
                                <FontAwesomeIcon onClick={async()=>{
                                    await deleteTodo({variables:{id: todo.id}})
                                    await refetch()
                                }} 
                                icon={faTrashAlt} /> 
                            
                            </Flex>
                        </Flex>
                      
                    ))} 
                </ul>
                )} 
            </Flex>
        </Container>
    )}