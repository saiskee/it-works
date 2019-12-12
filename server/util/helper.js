export const parseError = err => {
  if (err.isJoi) {
    return err.details[0];
  }
  return JSON.stringify(err, Object.getOwnPropertyNames(err));
}

export const sessionizeUser = user => {
  return {
    fullName: user.fullName,
    userId: user.id,
    username: user.username,
    positionTitle: user.positionTitle,
    companyName: user.companyName,
    startDate: user.startDate,

  };
}