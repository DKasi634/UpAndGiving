import {
  Action,
  ActionWithPayload,
  createAction,
} from "@/utils/reducer/reducer.utils";
import { AUTH_ACTION_TYPES } from "./auth.types";
import {
  AuthError,
  CustomError,
  getAuthError,
  getCustomError,
} from "@/utils/error.utils";
import { IProfile, IUser } from "@/api/types";
import { User } from "@supabase/supabase-js";

type RegisterStart = ActionWithPayload<
  AUTH_ACTION_TYPES.REGISTER_START,
  {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }
>;
type RegisterFailure = ActionWithPayload<
  AUTH_ACTION_TYPES.REGISTER_FAILURE,
  AuthError
>;
type RegisterSuccess = ActionWithPayload<
  AUTH_ACTION_TYPES.REGISTER_SUCCESS,
  IUser
>;

type GoogleSignInStart = Action<AUTH_ACTION_TYPES.GOOGLE_SIGNIN_START>;
type GoogleSignInComplete = ActionWithPayload<
  AUTH_ACTION_TYPES.GOOGLE_SIGNIN_COMPLETE,
  {email:string, displayName:string, phoneNumber:string, photoURL:string}
>;
type EmailSignInStart = ActionWithPayload<
  AUTH_ACTION_TYPES.EMAIL_SIGNIN_START,
  { email: string; password: string }
>;
type SignInFailure = ActionWithPayload<
  AUTH_ACTION_TYPES.SIGNIN_FAILURE,
  AuthError
>;
type SignInSuccess = ActionWithPayload<AUTH_ACTION_TYPES.SIGNIN_SUCCESS, {user:IUser, profile:IProfile}>;

type LogoutStart = Action<AUTH_ACTION_TYPES.LOGOUT_START>;
type LogoutFailure = ActionWithPayload<
  AUTH_ACTION_TYPES.LOGOUT_FAILURE,
  CustomError
>;
type LogoutSuccess = Action<AUTH_ACTION_TYPES.LOGOUT_SUCCESS>;

type UpdateUserStart = ActionWithPayload<
  AUTH_ACTION_TYPES.UPDATE_USER_START,
  IProfile
>;
type UpdateUserFailure = ActionWithPayload<
  AUTH_ACTION_TYPES.UPDATE_USER_FAILURE,
  AuthError
>;
type UpdateUserSuccess = ActionWithPayload<
  AUTH_ACTION_TYPES.UPDATE_USER_SUCCESS,
  IProfile
>;

type GetCurrentUser = Action<AUTH_ACTION_TYPES.GET_CURRENT_USER>;
type SetCurrentUser = ActionWithPayload<
  AUTH_ACTION_TYPES.SET_CURRENT_USER,
  string
>;

type ClearAuthError = Action<AUTH_ACTION_TYPES.CLEAR_AUTH_ERROR>;
type ClearNavigateToSignIn =
  Action<AUTH_ACTION_TYPES.CLEAR_NAVIGATE_TO_SIGN_IN>;

export type AuthAction =
  | RegisterFailure
  | RegisterStart
  | RegisterSuccess
  | GoogleSignInStart
  | GoogleSignInComplete
  | EmailSignInStart
  | SignInFailure
  | SignInSuccess
  | LogoutStart
  | LogoutFailure
  | LogoutSuccess
  | UpdateUserFailure
  | UpdateUserStart
  | UpdateUserSuccess
  | GetCurrentUser
  | SetCurrentUser
  | ClearAuthError

export const registerStart = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phoneNumber: string
): RegisterStart =>
  createAction(AUTH_ACTION_TYPES.REGISTER_START, {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
  });

export const registerSuccess = (createdUser: IUser): RegisterSuccess =>
  createAction(AUTH_ACTION_TYPES.REGISTER_SUCCESS, createdUser);

export const registerFailure = (error: unknown): RegisterFailure =>
  createAction(AUTH_ACTION_TYPES.REGISTER_FAILURE, getAuthError(error));

export const googleSignInStart = (): GoogleSignInStart =>
  createAction(AUTH_ACTION_TYPES.GOOGLE_SIGNIN_START);

export const googleSignInComplete = (
  user: User 
): GoogleSignInComplete =>
  createAction(AUTH_ACTION_TYPES.GOOGLE_SIGNIN_COMPLETE, {email:user.email||'', displayName:'', phoneNumber:user.phone||'',photoURL:'' });


export const emailSignInStart = (
  email: string,
  password: string
): EmailSignInStart =>
  createAction(AUTH_ACTION_TYPES.EMAIL_SIGNIN_START, { email, password });

export const signInFailure = (error: unknown): SignInFailure =>
  createAction(AUTH_ACTION_TYPES.SIGNIN_FAILURE, getAuthError(error));

export const signInSuccess = (user: IUser, profile:IProfile): SignInSuccess =>
  createAction(AUTH_ACTION_TYPES.SIGNIN_SUCCESS, { user, profile });

export const logoutStart = (): LogoutStart =>
  createAction(AUTH_ACTION_TYPES.LOGOUT_START);

export const logoutFailure = (error: unknown): LogoutFailure =>
  createAction(AUTH_ACTION_TYPES.LOGOUT_FAILURE, getCustomError(error));

export const logoutSuccess = (): LogoutSuccess =>
  createAction(AUTH_ACTION_TYPES.LOGOUT_SUCCESS);

export const updateUserStart = (profileToUpdate: IProfile): UpdateUserStart =>
  createAction(AUTH_ACTION_TYPES.UPDATE_USER_START, profileToUpdate);

export const updateUserFailure = (error: unknown): UpdateUserFailure =>
  createAction(AUTH_ACTION_TYPES.UPDATE_USER_FAILURE, getAuthError(error));

export const updateUserSuccess = (profileToUpdate: IProfile): UpdateUserSuccess =>
  createAction(AUTH_ACTION_TYPES.UPDATE_USER_SUCCESS, profileToUpdate);

export const getCurrentUser = (): GetCurrentUser =>
  createAction(AUTH_ACTION_TYPES.GET_CURRENT_USER);

export const setCurrentUser = (userEmail: string): SetCurrentUser =>
  createAction(AUTH_ACTION_TYPES.SET_CURRENT_USER, userEmail);

export const clearAuthError = (): ClearAuthError =>
  createAction(AUTH_ACTION_TYPES.CLEAR_AUTH_ERROR);


export const clearNavigateToSignIn = (): ClearNavigateToSignIn =>
  createAction(AUTH_ACTION_TYPES.CLEAR_NAVIGATE_TO_SIGN_IN);
