const handleSaveError = (error, data, next) => {
  const { code, name } = error;
  error.status = (code === 11000 && name === "MongoServserError") ? 409 : 400;
  next();
};
export default handleSaveError;