const errorCodes = {
  method_not_allowed: "Method is not allowed",
  no_mail: "User has no mail linked to his account",
  missing_id: "Session is missing a user id.",
  not_authentificated: "Not authenticated",
  IncorrectUsernamePassword: "incorrect-username-password",
  UserNotFound: "user-not-found",
  IncorrectPassword: "incorrect-password",
  UserMissingPassword: "missing-password",
  TwoFactorDisabled: "two-factor-disabled",
  TwoFactorAlreadyEnabled: "two-factor-already-enabled",
  TwoFactorSetupRequired: "two-factor-setup-required",
  SecondFactorRequired: "second-factor-required",
  IncorrectTwoFactorCode: "incorrect-two-factor-code",
  InternalServerError: "internal-server-error",
  NewPasswordMatchesOld: "new-password-matches-old",
  ThirdPartyIdentityProviderEnabled: "third-party-identity-provider-enabled",
  No2FACode: "Two factor non enabled",
  TwoFADisabled: "Two factor successfully disabled",
};

export default errorCodes;
