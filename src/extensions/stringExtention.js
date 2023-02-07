function getUserName(email) {
  return email.substring(0, email.indexOf("@"));
}

export { getUserName };
