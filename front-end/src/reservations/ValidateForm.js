function validateForm(form) {
    let result = [];

    result.push(firstnameValid(form.first_name));
    result.push(lastnameValid(form.last_name));
    result.push(mobilenumberValid(form.mobile_number));
    result.push(dateValid(form.reservation_date));
    result.push(timeValid(form.reservation_time));
    result.push(peopleValid(form.people));

    return result;
}

const firstnameValid = (value) => {
    if(value === "") {
        return "Please include your first name! ";
    }
    return "";
}

const lastnameValid = (value) => {
    if(value === ""){
        return "Please include your last name! "
    }
    return "";
}

const mobilenumberValid = (value) => {
    let result = "";
    switch(true) {
        case (value === 0):
            result += "Please include your mobile number! ";
            break;

        case (![10, 11, 7].includes(value.length)):
            result += "Your phone number is the wrong length! ";
            break;

        case (!/^\d+$/.test(value)):
            result += "Your phone number must only include numbers and dashes! ";
            break;
        default:
            break;
    }
    return result;
}

const dateValid = (value) => {
    let result = "";
    switch(true) {
        case (value === ""):
            result += "Please fill out reservation date! ";
            break;

        case (value.length !== 10):
            result += "Reservation date incomplete! ";
            break;

        case (value.replace(/-/g,'') < new Date().toJSON().slice(0,10).replace(/-/g,'')):
            result += "Set reservation date to be in the future! ";
            break;
        default:
            break;

    }
    return result;
}

const timeValid = (value) => {
    let result = "";

    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const currTime = (!hour.length < 2 ? "0" + hour : hour) + (minute.length < 2 ? "0" + minute : minute);
    
    const valForm = value.replace(/[: ]/g,"");

    switch(true) {
        case (value === ""):
            result += "Please fill out reservation time! ";
            break;

        case (valForm < currTime ):
            result += "Set reservation time to be in the future! ";
            break;

        case (valForm > 2130):
            result += "Reservation time needs be before 9:30 PM! ";
            break;

        case (valForm < 1030):
            result += "Reservation time needs be after 10:30 AM! ";
            break;
        default:
            break;
    }

    return result;
}

const peopleValid = (value) => {
    if(value < 1) {
        return "Please enter number of guests in your reservation! "
    }
    return "";
}

export default validateForm;