const error_codes = {
  method_not_allowed: "METHOD_NOT_ALLOWED",
  no_mail: "NO_MAIL",
  missing_id: "MISSING_ID",
  not_authenticated: "NOT_AUTHENTICATED",
  incorrect_username: "INCORRECT_USERNAME",
  user_not_found: "USER_NOT_FOUND",
  incorrect_password: "INCORRECT_PASSWORD",
  user_missing_password: "USER_MISSING_PASSWORD",
  two_factor_enabled: "TWO_FACTOR_ENABLED",
  two_factor_disabled: "TWO_FACTOR_DISABLED",
  two_factor_already_enabled: "TWO_FACTOR_ALREADY_ENABLED",
  two_factor_setup_required: "TWO_FACTOR_SETUP_REQUIRED",
  second_factor_required: "SECOND_FACTOR_REQUIRED",
  incorrect_two_factor_code: "INCORRECT_TWO_FACTOR_CODE",
  internal_server_error: "INTERNAL_SERVER_ERROR",
  new_password_matches_old: "NEW_PASSWORD_MATCHES_OLD",
  third_party_identity_provider_enabled: "THIRD_PARTY_IDENTITY_PROVIDER_ENABLED",
  no_2fa_code: "NO_2FA_CODE",
};

export default Object.freeze(error_codes);