/**
 * A collection of error codes used throughout the application.
 * These codes represent various success and error states.
 */
const errorCodes = {
    success: 'SUCCESS',
    method_not_allowed: 'METHOD_NOT_ALLOWED',
    no_mail: 'NO_MAIL',
    missing_id: 'MISSING_ID',
    not_authenticated: 'NOT_AUTHENTICATED',
    incorrect_username: 'INCORRECT_USERNAME',
    user_not_found: 'USER_NOT_FOUND',
    incorrect_password: 'INCORRECT_PASSWORD',
    user_missing_password: 'USER_MISSING_PASSWORD',
    two_factor_enabled: 'TWO_FACTOR_ENABLED',
    two_factor_disabled: 'TWO_FACTOR_DISABLED',
    two_factor_already_enabled: 'TWO_FACTOR_ALREADY_ENABLED',
    two_factor_setup_required: 'TWO_FACTOR_SETUP_REQUIRED',
    second_factor_required: 'SECOND_FACTOR_REQUIRED',
    incorrect_two_factor_code: 'INCORRECT_TWO_FACTOR_CODE',
    internal_server_error: 'INTERNAL_SERVER_ERROR',
    new_password_matches_old: 'NEW_PASSWORD_MATCHES_OLD',
    user_already_exists: 'USER_ALREADY_EXISTS',
    third_party_identity_provider_enabled: 'THIRD_PARTY_IDENTITY_PROVIDER_ENABLED',
    no_2fa_code: 'NO_2FA_CODE',
    success_user_created: 'SUCCESS_USER_CREATED',
    file_already_exists: 'FILE_ALREADY_EXISTS',
    folder_already_exists: 'FOLDER_ALREADY_EXISTS',
    totp_setup_success: 'TOTP_GENERATION_SUCCESS',
    seed_already_generated: 'SEED_ALREADY_GENERATED',
};

export default errorCodes;

/**
 * Sets a successful response status and returns a success message.
 *
 * @param {any} event - The event object representing the request.
 * @param {string} message - The success message to return.
 * @returns {{ message: string }} The response object containing the success message.
 */
export function setSuccess(event: any, message: string): { message: string } {
    setResponseStatus(event, 200);
    return { message };
}

/**
 * Sets a failure response status, logs the error, and returns an error message.
 *
 * @param {any} event - The event object representing the request.
 * @param {string} message - The error message to return.
 * @returns {{ message: string }} The response object containing the error message.
 */
export function setFail(event: any, message: string): { message: string } {
    console.error(message);
    setResponseStatus(event, 300, message);
    return { message };
}
