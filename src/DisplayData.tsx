import React, {ChangeEventHandler, useState} from 'react';
import Users from "./components/users/Users";
import Movies from "./components/movies/Movies";

const DisplayData = () => {
    const [isMovies, setIsMovies] = useState<boolean>(false)

    const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
        setIsMovies(event.target.checked);
    }

    return (
        <>
            <label htmlFor="checkbox">check for movies</label>
            <input id="checkbox" type="checkbox" onChange={onChangeHandler}/>
            <hr/>
            {
                isMovies ? <Movies/> : <Users/>
            }
        </>
    )
};

export default DisplayData;
