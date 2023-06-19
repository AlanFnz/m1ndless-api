export enum HTTP_STATUS_CODES {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  ALREADY_EXISTS = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const RESPONSE_MESSAGES = {
  // common
  VALIDATION_ERROR:
    'One or more errors occurred when validating this request body',
  OBJECT_ID_ERROR: 'Something went wrong when getting this object id',
  INVALID_ID: 'Invalid ID',
  // auth
  JWT_FAIL: 'Something went wrong when creating this token',
  JWT_REFRESH_INVALID: 'Invalid refresh token',
  JWT_REFRESH_MISSING: 'Missing required field: refreshToken',
  INVALID_DATA: 'Invalid email and/or password',
  // permissions
  FORBIDDEN: "This user doesn't have the required permissions",
  PERMISSION_PARSING_ERROR:
    "Something went wrong when parsing this user's permissions",
  USER_CANNOT_CHANGE_PERMISSIONS: 'User cannot change permission flags',
  // users
  USERS_GET_FAIL: 'Something went wrong when fetching users',
  USER_CREATE_FAIL: 'Something went wrong when creating this user',
  USER_GET_FAIL: 'Something went wrong when fetching this user',
  USER_UPDATE_FAIL: 'Something went wrong when updating this user',
  USER_DELETE_FAIL: 'Something went wrong when deleting this user',
  USER_PASSWORD_HASHING_ERROR:
    'Something went wrong when hashing this password',
  USER_PASSWORD_NOT_FOUND: 'Password field not found',
  USER_EMAIL_EXISTS: 'User email already exists',
  USER_EMAIL_INVALID: 'Invalid email',
  USER_NOT_FOUND: (userId: any) => `User ${userId} not found`,
  USER_LAST_LOGIN_UPDATE_ERROR:
    "Something went wrong when updating this user's last login date",
};
