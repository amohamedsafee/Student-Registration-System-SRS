const { ValidationError } = require('../errors/AppError');

/**
 * Validates request body, query, or params with a custom validator function or schema
 * @param {Function} validatorFn - (data) => { errors: { field: message } | null }
 * @param {'body'|'query'|'params'} source
 */
function validate(validatorFn, source = 'body') {
  return (req, res, next) => {
    const data = req[source];
    const validationResult = validatorFn(data);

    if (validationResult && validationResult.errors && Object.keys(validationResult.errors).length > 0) {
      return next(
        new ValidationError('Input validation failed. Please check the provided values.', validationResult.errors)
      );
    }

    next();
  };
}

module.exports = validate;
