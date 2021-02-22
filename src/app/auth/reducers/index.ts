import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
  on
} from '@ngrx/store';
import { AuthActions } from '../action-types';
import { User } from '../model/user.model';

export interface AuthState {
  user: User
}

export const initialAuthState = {
  user: undefined
}


// What should the store do in response to a login action
export const authReducer = createReducer(

  initialAuthState,
  on(AuthActions.login, (state, action) => {
    return {
      user: action.user
    }
  }),

  on(AuthActions.logout, (state, action) => {
    return {
      user: undefined
    }
  })
);
//
// function AuthReducer(state, action): AuthState = {

// }