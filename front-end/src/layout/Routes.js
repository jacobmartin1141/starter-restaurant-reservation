import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Tables from "../tables/TablesNew";
import NewReservations from "../reservations/NewReservations";
import SeatReservations from "../reservations/SeatReservation";
import EditReservation from "../reservations/EditReservation";
import Search from "../search/Search";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/tables">
        <Tables />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <SeatReservations />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route path="/reservations/new">
        <NewReservations />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
