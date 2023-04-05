function getUserName(email) {
  return email.substring(0, email.indexOf("@"));
}

function formatDateTime(dateTime) {
  return `${dateTime.getDate().toString().padStart(2, "0")}/${(
    dateTime.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${dateTime.getFullYear()} ${dateTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${dateTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${dateTime.getSeconds().toString().padStart(2, "0")}`;
}

export { getUserName, formatDateTime };
