import React, { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';

import { listTables, readReservation, seatTable, updateReservationData } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation() {
    const { reservation_id } = useParams();
    
    const history = useHistory();

    const reservationPlacehoder = {
        first_name: "",
        last_name: "",
        mobile_number: 0,
        people: 0,
        reservation_date: "",
        reservation_time: "",
    }

    const [ reservation ,setReservation ] = useState(reservationPlacehoder);
    const [ reservationError, setReservationError ] = useState(null);
    const [ tables, setTables ] = useState([]);
    const [ tablesError, setTablesError ] = useState(null);
    const [ selection, setSelection ] = useState(1);

    useEffect(loadReservations, [reservation_id]);

    useEffect(loadTables, []);

    function loadReservations() {
        const abortController = new AbortController();
        setReservationError(null);
        readReservation(reservation_id, {}, abortController.signal)
            .then(setReservation)
            .catch(setReservationError);
        return () => abortController.abort();
    }

    function loadTables() {
        const abortController = new AbortController();
        setTablesError(null);
        listTables(abortController.signal)
            .then(setTables)
            .catch(setTablesError);
        return () => abortController.abort();
    }
    
    const submitHandler = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        try {
            await updateReservationData(reservation.reservation_id, {status: "seated"}, abortController.signal);
            await seatTable(selection, reservation.reservation_id, abortController.signal);
            history.push("/dashboard");
        } catch(error) {
            console.log(error);
        }

        return () => abortController.abort();
    }

    const displayTableOptions = tables.map((table, index) => {
        if(table.occupied || reservation.people > table.capacity) {
            return null;
        }
        return <option
            name={table.table_name}
            value={table.table_id}
            key={index}
        >{table.table_name} - {table.capacity}</option>
    });

    return(<main>
        <ErrorAlert error={reservationError} />
        <ErrorAlert error={tablesError} />
        <h2>Seat Reservation</h2>
        {reservation.first_name !== "" ?
        <>
            <h4>Reservation for {reservation.first_name} {reservation.last_name}, seating {reservation.people} {reservation.people === 1 ? "person" : "people"}:</h4>
            <h5>Mobile number: {reservation.mobile_number}, Time: {reservation.reservation_time}, {reservation.reservation_date}</h5>
        </>
        :
            <h2>Loading...</h2>
        }
        <form>
            <label htmlFor="table_id">Table number:</label>
            <select
                name="table_id"
                onChange={(event) => setSelection(event.target.value)}
            >
                {displayTableOptions}
            </select><br/>
            <button onClick={submitHandler}>Submit</button>
        </form>
        <button onClick={() => history.push("/")} >Cancel</button>
    </main>);
}

export default SeatReservation;
