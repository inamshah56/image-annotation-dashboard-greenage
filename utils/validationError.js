exports.validationError = (err) => {
    let errors = {};

    err.errors.forEach((error) => {
        const { path, message } = error;
        errors[path] = message; // Assign message to the errors object
    });

    if (Object.keys(errors).length > 0) {
        return errors
    }
}