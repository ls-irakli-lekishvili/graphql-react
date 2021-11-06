import React, {useState} from 'react';
import {gql, useLazyQuery, useQuery} from "@apollo/client";

interface Movie {
    id: string | number;
    date: number;
    inTheaters: boolean;
    name: string;
}

interface MovieArgument {
    name: string;
}

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

const QUERY_GET_MOVIE = gql`
    query GetMovie($name: String!) {
        movie(name: $name) {
            date
            name
        }
    }
`;

const Movies = () => {
    const [movieName, setMovieName] = useState<string>('');

    // get movies data
    const {data: moviesData, loading: moviesLoading} = useQuery<{ movies: Array<Movie> }>(QUERY_ALL_MOVIES);

    // get single movie data by name lazy
    const [fetchMovies, {
        data: movieData,
        loading: movieLoading,
    }] = useLazyQuery<{ movie: Movie }, MovieArgument>(QUERY_GET_MOVIE);


    if (moviesLoading) {
        return <div>loading movies...</div>
    }
    return (
        <>
            <div>
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
            </div>
            <hr/>
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

                {
                    movieLoading === false && movieData?.movie ?
                        (<div>
                            <hr/>
                            <div>{movieData?.movie.name}</div>
                            <div>{movieData?.movie.date}</div>
                        </div>) :
                        null
                }
            </div>
        </>
    );
};

export default Movies;
