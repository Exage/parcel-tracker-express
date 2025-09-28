export const USER_ERRORS = {
    REQUIRED_FIELDS: 'All fields must be filled in!',
    PASSWORD_SHORT: 'Password must be more than 6 characters long!',
    PASSWORD_INCORRECT: 'Incorrect password!',
    ALREADY_EXISTS: 'This user already exists!',
    NOT_FOUND: 'This user was not found!',
    ID_REQUIRED: 'User ID is required!',
}

export const COMMON_ERRORS = {
    UNEXPECTED: 'Unexpected error',
    ROUTE_NOT_FOUND: 'Route not found',
}

export const AUTH_ERRORS = {
    TOKEN_REQUIRED: 'Authorization token required',
    TOKEN_INVALID: 'Request is not authorized',
}

export const JWT_ERRORS = {
    SECRET_NOT_DEFINED: 'JWT_SECRET is not defined',
    EXPIRES_NOT_DEFINED: 'JWT_EXPIRES_IN is not defined',
}
