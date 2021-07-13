import React, { useEffect, useState } from "react";
import {useHistory} from 'react-router-dom';
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Tables() {
    const formInit = {
        table_name:"",
        capacity:0,
    }
    const [form, setForm] = useState(formInit);
    const [error, setError] = useState(null)
    const history = useHistory();

    useEffect(() => {
        console.log(form);
    }, [form]);

    const changeHandler = (event) => {
        let newForm = {...form}
        newForm[event.target.name] = event.target.value
        setForm(newForm);
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        let result = "";
        
        result += table_nameValid(form.table_name);
        result += capacityValid(form.capacity);

        if(result === "") {
            setError(null);

            const abortController = new AbortController();
            createTable(form, abortController.signal)
                .then(console.log)
                .catch(setError);
            history.push('/dashboard');

        } else {
            setError({message: result});
        }
    }

    const cancelHandler = (event) => {
        history.goBack();
    }
    
    //DATA VALIDATORS::
    const table_nameValid = (value) => {
        let result = "";
        switch(true) {
            case(value === ""):
                result += "Please include the table's name! ";
                break;

            case(value.length < 2):
                result += "Table name must be at least two characters long! ";
                break;
                
            default:
                break;
        }
        return result;
    }

    const capacityValid = (value) => {
        let result = "";
        switch(true) {
            case (!value):
                result += "Please enter the table's capacity! ";
                break;

            case (value < 1):
                result += "The table's capacity must be at least 1! ";
                break;
            default:
                break;
        }
        return result;
    }

    return(<div>
        <ErrorAlert error={error}/>
        <form>
            <label htmlFor="table_name">
                Table Name:
            </label>
            <input
                type="text"
                name="table_name"
                id="table_name"
                value={form.table_name}
                onChange={changeHandler}
                required
            /><br/>
            <label htmlFor="capacity">
                Capacity:
            </label>
            <input
                type="number"
                name="capacity"
                id="capacity"
                value={form.capacity}
                onChange={changeHandler}
                required
            /><br/>
            <button onClick={submitHandler}>Submit</button>
      </form>
      <button onClick={cancelHandler}>Cancel</button>
  </div>);
}

export default Tables;