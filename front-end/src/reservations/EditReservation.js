import React, { useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { updateReservationData } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import validateForm from "./ValidateForm";
import ReservationForm from "./ReservationForm";

import { readReservation } from "../utils/api";

function EditReservation() {
    const { reservation_id } = useParams();

    const history = useHistory();

    const [reservation, setReservation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(loadReservations, [reservation_id]);

    function loadReservations() {
        const abortController = new AbortController();
        setError(null);
        readReservation(reservation_id, {}, abortController.signal)
            .then(setReservation)
            // .catch(setError)
        return () => abortController.abort();
    }

    const submitHandler = async (event) => {
        event.preventDefault();

        const result = validateForm(reservation);
        
        if(result.find((curr) => curr !== "") === undefined) {
            try {
                const abortController = new AbortController();
                await updateReservationData(reservation.reservation_id, {...reservation}, abortController.signal)
                history.goBack();
            } catch(e) {
                setError(e);
            }
        } else {
            setError({message: result});
        }
    }

    return(<main>
        <ErrorAlert error={error} />
        <h2>Edit Reservation:</h2>
        {reservation ? 
            <>
                <ReservationForm form={reservation} setForm={setReservation}/>
                <button onClick={submitHandler}>Submit</button>
            </>
        :
            <h2>Loading...</h2>
        }
        <button onClick={history.goBack}>Cancel</button>
    </main>);
}

export default EditReservation;