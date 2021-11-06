import React, {FormEventHandler, useRef, useState} from 'react';
import {useQuery, useLazyQuery, gql, useMutation} from "@apollo/client";

interface User {
    age: number;
    id: string | number;
    name: string;
    nationality: string;
    username: string;
}

interface Movie {
    id: string | number;
    date: number;
    inTheaters: boolean;
    name: string;
}

interface UserArgument {
    id: string;
}

interface MovieArgument {
    name: string;
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

const QUERY_ALL_MOVIES = gql`
    query GetMovies {
        movies {
            id
            date
            inTheaters
            name
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

const QUERY_GET_MOVIE = gql`
    query GetMovie($name: String!) {
        movie(name: $name) {
            id
            date
            inTheaters
            name
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
`

const DisplayData = () => {
    const [movieName, setMovieName] = useState<string>('');
    // get users data
    const {data: usersData, loading: usersLoading, refetch} = useQuery<{ users: Array<User> }>(QUERY_ALL_USERS);
    // get movies data
    const {data: moviesData, loading: moviesLoading} = useQuery<{ movies: Array<Movie> }>(QUERY_ALL_MOVIES);
    // get single user data by id
    const {data: userData, loading: userLoading} = useQuery<{ user: User }, UserArgument>(QUERY_GET_USER,
        {variables: {id: '1'}});

    const nameRef = useRef<HTMLInputElement>(null)
    const userNameRef = useRef<HTMLInputElement>(null)
    const ageRef = useRef<HTMLInputElement>(null)

    // get single movie data by name lazy
    const [fetchMovies, {
        data: movieData,
        loading: movieLoading,
        called
    }] = useLazyQuery<{ movie: Movie }, MovieArgument>(QUERY_GET_MOVIE);

    // create user

    const [createUser, {
        data: newUser
    }] = useMutation<{ createUser: User }, CreateUserInput>(MUTATION_CREATE_USER);

    if (!movieLoading && called)
        console.log(movieData);


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

    if (usersLoading || moviesLoading) return <h1>loading ...</h1>
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

            {
                moviesData?.movies.map(({id, date, inTheaters, name}) => {
                    return (
                        <div key={id}>
                            <div>{date}</div>
                            <div>{inTheaters.toString()}</div>
                            <div>{name}</div>
                        </div>
                    )
                })
            }

            <div>
                <input type="text" placeholder='search movie' onChange={(event) => {
                    setMovieName(event.target.value);
                }}/>
                <button onClick={() => fetchMovies({
                    variables: {
                        name: movieName
                    }
                })}>fetch movie
                </button>
                {}
            </div>

            <form onSubmit={onSubmitHandler}>
                <input ref={nameRef} type="text" placeholder='name'/>
                <input ref={userNameRef} type="text" placeholder='username'/>
                <input ref={ageRef} type="number" placeholder='age'/>
                <button type='submit'>create</button>
            </form>
        </div>
    );
};

export default DisplayData;
