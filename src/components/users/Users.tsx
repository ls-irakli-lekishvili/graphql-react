import React, {FormEventHandler, useRef} from 'react';
import {gql, useMutation, useQuery} from "@apollo/client";

interface User {
    age: number;
    id: string | number;
    name: string;
    nationality: string;
    username: string;
}

interface UserArgument {
    id: string;
}

enum Nationality {
    GEORGIA,
    USA,
    CANADA,
    China,
    AFRICA,
    GERMANY,
    UNKNOWN
}

interface CreateUserInput {
    input: {
        name: string;
        username: string;
        age: number;
        nationality?: Nationality;
    }
}

const QUERY_ALL_USERS = gql`
    query GetAllUsers {
        users {
            name
            id
            age
            nationality
            username
        }
    }
`;


const QUERY_GET_USER = gql`
    query GetUser($id: ID!) {
        user(id: $id) {
            name
            id
            age
            nationality
            username
        }
    }
`;

const MUTATION_CREATE_USER = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            name,
            username,
        }
    }
`;



const Users = () => {
    const {data: usersData, loading: usersLoading, refetch} = useQuery<{ users: Array<User> }>(QUERY_ALL_USERS);
    // get single user data by id
    const {data: userData, loading: userLoading} = useQuery<{ user: User }, UserArgument>(QUERY_GET_USER,
        {variables: {id: '1'}});

    const nameRef = useRef<HTMLInputElement>(null)
    const userNameRef = useRef<HTMLInputElement>(null)
    const ageRef = useRef<HTMLInputElement>(null)

    // create user

    const [createUser, {
        data: newUser
    }] = useMutation<{ createUser: User }, CreateUserInput>(MUTATION_CREATE_USER);


    const onSubmitHandler: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        createUser({
            variables: {
                input: {
                    age: Number(ageRef.current!.value),
                    username: userNameRef.current!.value,
                    name: nameRef.current!.value,
                }
            }
        }).then((value => {
            refetch();
        }))
    }

    if (usersLoading) return <h1>loading ...</h1>
    return (
        <div>
            {
                usersData?.users.map(({id, username, age, name, nationality}) => {
                    return (
                        <div key={id}>
                            <div>{username}</div>
                            <div>{age}</div>
                            <div>{name}</div>
                            <div>{nationality}</div>
                        </div>
                    )
                })
            }
            <hr/>
            <form onSubmit={onSubmitHandler}>
                <input ref={nameRef} type="text" placeholder='name'/>
                <input ref={userNameRef} type="text" placeholder='username'/>
                <input ref={ageRef} type="number" placeholder='age'/>
                <button type='submit'>create</button>
            </form>
        </div>
    );
};

export default Users;
