import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import ReservationForm from "./ReservationForm";
import validateForm from "./ValidateForm";

function NewReservations() {
    const formInit = {
        first_name:"",
        last_name:"",
        mobile_number:0,
        reservation_date:"",
        reservation_time:"",
        people:0,
    }
    const [form, setForm] = useState(formInit);
    const [error, setError] = useState(null)
    const history = useHistory();

    useEffect(() => {
        console.log(form);
    }, [form]);

    const submitHandler = async (event) => {
        event.preventDefault();
        const result = validateForm(form);
        if(result.find((curr) => curr !== "") === undefined) {
            setError(null);

            const abortController = new AbortController();
            await createReservation(form, abortController.signal)
                .then(console.log)
                .catch(setError);
            
            // history.push('/dashboard');
        } else {
            setError({message: result});
        }
    }

    const cancelHandler = (event) => {
        history.goBack();
    }

    return(<div>
        <ErrorAlert error={error}/>
        <h2>New Reservation:</h2>
        <ReservationForm form={form} setForm={setForm} />
        <button onClick={submitHandler}>Submit</button>
        <button onClick={cancelHandler}>Cancel</button>
  </div>);
}

export default NewReservations;
