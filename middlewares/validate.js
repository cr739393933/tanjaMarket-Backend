const ErrorResponse = require("../utils/ErrorResponse");
 
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
 
  if (!result.success) {
    const message = result.error.errors
      .map((e) => e.message)
      .join(", ");
 
    return next(new ErrorResponse(message, 400));
  }
 
  req.body = result.data;
  next();
};
 
module.exports = validate;