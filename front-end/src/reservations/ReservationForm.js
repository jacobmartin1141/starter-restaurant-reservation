
function ReservationForm({ form, setForm }) {
    const changeHandler = (event) => {
        let newForm = {...form}
        newForm[event.target.name] = event.target.value
        setForm(newForm);
    }

    return(<form>
        <label htmlFor="first_name">
            First Name:
        </label>
        <input
            type="text"
            name="first_name"
            id="first_name"
            value={form.first_name}
            onChange={changeHandler}
            required
        /><br/>
        <label htmlFor="last_name">
            Last Name:
        </label>
        <input
            type="text"
            name="last_name"
            id="last_name"
            value={form.last_name}
            onChange={changeHandler}
            required
        /><br/>
        <label htmlFor="mobile_number">
            Mobile Number:
        </label>
        <input
            type="text"
            name="mobile_number"
            id="mobile_number"
            value={form.mobile_number}
            onChange={changeHandler}
            required
        /><br/>
        <label htmlFor="reservation_date">
            Reservation Date:
        </label>
        <input
            type="date"
            placeholder="YYYY-MM-DD"
            name="reservation_date"
            id="reservation_date"
            value={form.reservation_date}
            onChange={changeHandler}
            required
        /><br/>
        <label htmlFor="reservation_time">
            Reservation Time:
        </label>
        <input
            type="time"
            placeholder="HH:MM"
            pattern={"[0-9]{2}:[0-9]{2}"}
            name="reservation_time"
            id="reservation_time"
            value={form.reservation_time}
            onChange={changeHandler}
            required
        /><br/>
        <label htmlFor="people">
            People:
        </label>
        <input
            type="number"
            name="people"
            id="people"
            value={form.people}
            onChange={changeHandler}
            required
        /><br/>
  </form>)
}

export default ReservationForm;