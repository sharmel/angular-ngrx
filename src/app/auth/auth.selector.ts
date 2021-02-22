import { state } from "@angular/animations";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./reducers";

//feature selector
export const selectAuthState = 
createFeatureSelector<AuthState>(
    "auth"
);

// 
export const isLoggedIn = createSelector(

    selectAuthState, // return auth
    auth => !!auth.user // projector function, use the get the user from the auth returned
);

export const isLoggedOut = createSelector(
    isLoggedIn,
    loggedIn => !loggedIn // projector function, loggedIn is returned from isLoggedIn
)