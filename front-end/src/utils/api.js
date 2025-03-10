/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { method: 'GET', headers, signal }, [])
    // .then(console.log)
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function readReservation(reservationId, params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservationId}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { method: 'GET', headers, signal }, []);
}

export async function findReservation(mobile_phone, signal) {
  const url = new URL(`${API_BASE_URL}/reservations?mobile_phone=${mobile_phone}`);
  return await fetchJson(url, {method: 'GET', signal});
}

export async function createReservation(body, params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetch(url, { method: 'POST', headers, signal, body});
}

export async function updateReservationData(reservationId, newData, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservationId}/status`);
  return await fetchJson(url, { method: 'PUT', headers, signal, body: JSON.stringify({data: {...newData}}) });
}

export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { method: 'GET', headers, signal }, []);
}

export async function seatTable(table_id, reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  return await fetchJson(url, { method: 'PUT', headers, signal, body: JSON.stringify({ data: {reservation_id} }) }, []);
}

export async function createTable(body, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetch(url, { method: 'POST', headers, signal, body});
}

export async function finishTable(table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  return await fetch(url, { method: 'DELETE', headers, signal});
}
