import { useState } from "react";
import { useHistory } from "react-router";
import { updateReservationData } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function ReservationCard({reservation}) {
  const history = useHistory();

    const [error, setError] = useState(null);

    const cancelHandler = async (event) => {
        event.preventDefault();

        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            try{
                const abortController = new AbortController();
                await updateReservationData(reservation.reservation_id, {status:"cancelled"}, abortController.signal);

                history.go(0);
            } catch(error) {
                setError(error);
            }
        }
    }

    return(<div>
      <ErrorAlert error={error} />
      <h4>#{reservation.reservation_id} Reservation for {reservation.first_name} {reservation.last_name}, seating {reservation.people} {reservation.people === 1 ? "person" : "people"}:</h4>
      <h5>Mobile number: {reservation.mobile_number}, Time: {reservation.reservation_time}</h5>
      
      <h6 data-reservation-id-status={reservation.reservation_id}>Status: {reservation.status}</h6>
      
      {reservation.status === "booked" ? 
        <><a
          href={`/reservations/${reservation.reservation_id}/seat`}>
            Seat
        </a><br/>
        <a href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a><br/>
        </>
      : null}
      <button data-reservation-id-cancel={reservation.reservation_id} onClick={cancelHandler}>Cancel</button>
    </div>);
  }

export default ReservationCard;