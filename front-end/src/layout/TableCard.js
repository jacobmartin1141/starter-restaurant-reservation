import React from "react";
import { finishTable, updateReservationData } from "../utils/api";

function TableCard({table, occupied = true}) {
    const finishHandler = () => {
        if(window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
            const abortController = new AbortController();
            finishTable(table.table_id, abortController.signal);
            updateReservationData(table.reservation_id, {status:"finished"}, abortController.signal)
            return () => abortController.abort();
        }
    }

    return(<div>
        <h4>Table {table.table_id}: '{table.table_name}'</h4>
        {occupied ? <>
            <h6 data-table-id-status={table.table_id}>(Occupied)</h6>
            <button data-table-id-finish={table.table_id} onClick={finishHandler}>Finish</button>
        </> 
        :
        <>
            <h6 data-table-id-status={table.table_id}>(Free)</h6>
            <h5>Capacity: {table.capacity}</h5>
        </>}
    </div>);
}

export default TableCard;