import React, { useState } from "react";
import { findReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import ReservationCard from "../layout/ReservationCard";

function Search() {
    const [search, setSearch] = useState(null);
    const [found, setFound] = useState(null);
    const [error, setError] = useState(null);

    const loadSearch = async (event) => {
        event.preventDefault();
        if (search) {
            try {
                setFound(null);
                const abortController = new AbortController();
                const response = await findReservation(search, abortController.signal);
    
                if (response) {
                    setFound(response);
                }
            } catch(error) {
                setError(error);
            }
        }
    }

    return (<main>
        <ErrorAlert error={error} />
        <h1>Search</h1>
        <form>
            <label htmlFor="mobile_number">Search phone numbers:</label>
            <input
                name="mobile_number"
                id="mobile_number"
                onChange={(event) => {setSearch(event.target.value)}}
                placeholder="Enter a customer's phone number"
            /><br/>
            <button onClick={loadSearch}>Find</button>
        </form>
        {found ? 
            <><h2>Results:</h2>{found.map((item, index) => {return <ReservationCard reservation={item} key={index} />})}</>
        :
            <h2>No reservations found</h2>
        }
    </main>);
}

export default Search;
