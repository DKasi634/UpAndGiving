import { takeLatest, all, call, put } from "redux-saga/effects";
import { AUTH_ACTION_TYPES } from "./auth.types";
import { ActionWithPayload } from "@/utils/reducer/reducer.utils";

import { IProfile, IUser, USER_ROLE_TYPE } from "@/api/types";
import {
  logoutFailure,
  logoutStart,
  logoutSuccess,
  // logoutFailure,
  // logoutSuccess,
  registerFailure,
  registerSuccess,
  setCurrentUser,
  signInFailure,
  signInSuccess,
  updateProfileFailure,
  updateProfileSuccess,
} from "./auth.actions";

import { setErrorToast, setSuccessToast } from "../toast/toast.actions";
import { getAuthError } from "@/utils/error.utils";
import {
  createOrUpdateProfile,
  createOrUpdateUser,
  getProfileByUserId,
  getUserByEmail,
} from "@/utils/supabase/supabase.utils";
import { supabaseSignInWithEmail, supabaseSignOut, supabaseSignUp } from "@/utils/supabase/supabase.auth";
import { User } from "@supabase/supabase-js";
import { getNewUUID } from "@/utils";

function* registerUser({
  payload: { firstName, lastName, email, password, phoneNumber, accountType },
}: ActionWithPayload<
  AUTH_ACTION_TYPES.REGISTER_START,
  {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    accountType:USER_ROLE_TYPE
  }
>) {
  try {
    const newAuthUser: User | null = yield call(
      supabaseSignUp,
      email,
      password
    );

    if (!newAuthUser) {
      throw new Error("Failed to create the user");
    }

    const userToCreate: IUser = {
      id: getNewUUID(),
      email,
      created_at: new Date(),
      role:accountType || USER_ROLE_TYPE.DONOR,
    };
    const createdUser: IUser | null = yield call(
      createOrUpdateUser,
      userToCreate
    );
    let createdProfile: IProfile | null = null;
    if (createdUser) {
      const newUserProfile: IProfile = {
        id: getNewUUID(),
        user_id: createdUser.id,
        name: `${firstName} ${lastName}`,
        profile_image: `https://placehold.co/200x200/207fff/FFF?text=${
          firstName.at(0)?.toUpperCase() || email.at(0)?.toUpperCase()
        }`,
        phone_number: phoneNumber,
        verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      };
      createdProfile = yield call(
        createOrUpdateProfile,
        createdUser.id,
        newUserProfile
      );
      if(!createdUser || !createdProfile){ throw new Error("Failed to register user ") }
      yield put(registerSuccess(createdUser));
    }
    yield put(logoutStart());
    yield put(
      setSuccessToast(
        "Signup succesfull ! Please check your mail box (or spams) to verify your account"
      )
    );
  } catch (error) {
    yield put(registerFailure(error));
    yield put(setErrorToast(getAuthError(error).message));
  }
}

function* emailSignIn({
  payload: { email, password },
}: ActionWithPayload<
  AUTH_ACTION_TYPES.EMAIL_SIGNIN_START,
  { email: string; password: string }
>) {
  try {
    const user: User | null = yield call(
      supabaseSignInWithEmail,
      email,
      password
    );
    if (!user) {
      throw new Error("Signin failed, something went wrong !");
    }

    const supabaseUser: IUser | null = yield call(getUserByEmail, email);
    if (!supabaseUser) {
      throw new Error("Could not find user");
    }
    yield put(setCurrentUser(supabaseUser.email));
    yield put(setSuccessToast("Signed in "));

  } catch (error) {
    yield put(signInFailure(error));
    yield put(setErrorToast(getAuthError(error).message));
  }
}

function* googleSignInComplete({
  payload: { email, displayName, phoneNumber, photoURL },
}: ActionWithPayload<
  AUTH_ACTION_TYPES.GOOGLE_SIGNIN_COMPLETE,
  {
    email: string;
    displayName: string;
    createdAt: string;
    phoneNumber: string;
    photoURL: string;
  }
>) {
  try {
    if (!email) {
      throw new Error("Signin failed, something went wrong !");
    }
    const existingUser: IUser | null = yield call(getUserByEmail, email);
    const firstName =
      displayName?.split(" ")[0] || `User@${new Date().getTime()}`;

    const lastName = displayName?.split(" ")[1] || ``;

    const newUser: IUser = {
      email,
      role: existingUser?.role || USER_ROLE_TYPE.DONOR,
      created_at: new Date(),
      id: getNewUUID(),
    };
    const supabaseUser: IUser = { ...existingUser, ...newUser };

    const createdUser: IUser | null = yield call(
      createOrUpdateUser,
      supabaseUser
    );
    let createdProfile: IProfile | null = null;
    if (createdUser) {
      const newUserProfile: IProfile = {
        id: getNewUUID(),
        user_id: createdUser.id,
        name: `${firstName} ${lastName}`,
        profile_image:
          photoURL ||
          `https://placehold.co/200x200/207fff/FFF?text=${
            firstName.at(0)?.toUpperCase() || email.at(0)?.toUpperCase()
          }`,
        phone_number: phoneNumber,
        verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      };
      createdProfile = yield call(
        createOrUpdateProfile,
        createdUser.id,
        newUserProfile
      );
    }
    if (!createdUser || !createdProfile) {
      throw new Error("Failed to create user or profile!");
    }
    yield put(setCurrentUser(createdUser.email));
  } catch (error) {
    yield put(signInFailure(error));
    yield put(setErrorToast(getAuthError(error).message));
  }
}

export function* watchRegistration() {
  yield takeLatest(AUTH_ACTION_TYPES.REGISTER_START, registerUser);
}

export function* watchEmailSignin() {
  yield takeLatest(AUTH_ACTION_TYPES.EMAIL_SIGNIN_START, emailSignIn);
}

export function* watchGoogleSignInCompletion() {
  yield takeLatest(
    AUTH_ACTION_TYPES.GOOGLE_SIGNIN_COMPLETE,
    googleSignInComplete
  );
}

function* setAuthUser({
  payload: email,
}: ActionWithPayload<AUTH_ACTION_TYPES.SET_CURRENT_USER, string>) {
  try {
    const thisUser: IUser | null = yield call(getUserByEmail, email);
    let thisUserProfile: IProfile | null = null;
    if (thisUser) {
      thisUserProfile = yield call(getProfileByUserId, thisUser.id);
    }
    if (thisUser && thisUserProfile) {
      yield put(signInSuccess(thisUser, thisUserProfile));
    } else {
      throw new Error("Something went wrong, no user or profile !");
    }
  } catch (error) {
    yield put(signInFailure(error));
    yield put(setErrorToast(getAuthError(error).message));
  }
}

function* logAuthUserOut(){
  try {
    const loggedOut:boolean = yield call(supabaseSignOut);
    if(loggedOut){
      yield put(logoutSuccess())
    }else{
      throw new Error("Logout failed !")
    }
  } catch (error) {
    yield put(logoutFailure(error))
  }
}

function* updateProfile({payload:profile}:ActionWithPayload<AUTH_ACTION_TYPES.UPDATE_USER_START, IProfile>){
  try {
    const updatedProfile:IProfile|null = yield call(createOrUpdateProfile, profile.user_id, profile);
    if(!updatedProfile){
      throw new Error("Failed to update profile")
    }
    yield put(updateProfileSuccess(updatedProfile))
  } catch (error) {
    yield put(updateProfileFailure(error))
  }
}

export function* watchSetCurrentUser() {
  yield takeLatest(AUTH_ACTION_TYPES.SET_CURRENT_USER, setAuthUser);
}

export function* watchLogout(){
  yield takeLatest(AUTH_ACTION_TYPES.LOGOUT_START, logAuthUserOut)
}

export function* watchUserUpdate(){
  yield takeLatest(AUTH_ACTION_TYPES.UPDATE_USER_START,  updateProfile)
}

export function* authSaga() {
  yield all([
    call(watchRegistration),
    call(watchEmailSignin),
    call(watchGoogleSignInCompletion),
    call(watchLogout),
    call(watchUserUpdate),
    call(watchSetCurrentUser)
  ]);
}
