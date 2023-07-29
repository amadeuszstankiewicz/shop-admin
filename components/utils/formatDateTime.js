function formatDateTime( dateString ) {
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year.toString().slice(-2)}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return formattedDate + " " + formattedTime
}

export default formatDateTime;