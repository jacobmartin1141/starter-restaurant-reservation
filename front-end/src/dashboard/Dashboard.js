import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import TableCard from "../layout/TableCard";
import ReservationCard from "../layout/ReservationCard";
import { today, next, previous } from "../utils/date-time";
import { useHistory, useLocation } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const { search } = useLocation();

  const history = useHistory();

  const [ date, setDate ] = useState(today());
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  
  useEffect(() => {
    if (search.split("=")[1]) {

      setDate(search.split("=")[1]);
    }
  }, [search]);

  useEffect(loadReservations, [date]);

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();

    setTablesError(null);
    listTables(abortController.signal)
      .then((data) => {
        return data.sort(tableSort);
      })
      .then(setTables)
      .catch(setTablesError);
      
    return () => abortController.abort();
  }

  function loadReservations() {
    const abortController = new AbortController();
    
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then((data) => {
        return data.sort(reservationSort);
      })
      .then(setReservations)
      .catch(setReservationsError);
    
    return () => abortController.abort();
  }

  const reservationsDisplay = reservations.map((reservation, index) => {
    // console.log(reservation.first_name, reservation.reservation_date);
    if(["booked", "seated"].includes(reservation.status)) {
      return <ReservationCard reservation={reservation} key={index}/>;
    }
    return null;
  });

  function reservationSort(a, b) {
    if(a.reservation_date < b.reservation_date) {
      return -1;
    }
    if(a.reservation_date > b.reservation_date) {
      return 1;
    }
    return 0;
  }

  function tableSort(a, b) {
    if(a.table_name < b.table_name) {
      return -1;
    }
    if(a.table_name > b.table_name) {
      return 1;
    }
    return 0;
  }

  const tablesDisplayOccupied = tables.map((table, index) => {
    if(table.occupied) {
      return <TableCard
        table={table}
        key={reservationsDisplay.length + index + 1}
      />;
    }
    return null;
  });

  const tablesDisplayAll = tables.map((table, index) => {
    return <TableCard
      table={table}
      occupied={table.occupied}
      key={reservationsDisplay.length + tablesDisplayOccupied.length + index + 1}
    />;
  });
  
  return (<main>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <h1>Dashboard</h1>

      <button onClick={() => history.push(`dashboard?date=${previous(date)}`)}>Previous</button>
      <button onClick={() => history.push(`dashboard?date=${today()}`)}>Today</button>
      <button onClick={() => history.push(`dashboard?date=${next(date)}`)}>Next</button>
      
      <div className="d-md-flex mb-3">
        {reservationsDisplay.filter((value) => (value !== "" ? value : null )).length !== 0 ?
          <>
            <h2 className="mb-0">Reservations for date {date}:</h2>
            {reservationsDisplay}
          </>
          :
          <h2>No reservations on {date}!</h2>
        }
      </div>
      <div className="d-md-flex mb-3">
        <h2 className="mb-0">All Tables:</h2>
      </div>
      {tablesDisplayAll}
      <div className="d-md-flex mb-3">
        <h2 className="mb-0">Occupied Tables:</h2>
      </div>
      {tablesDisplayOccupied}
    </main>
  );
}

export default Dashboard;
