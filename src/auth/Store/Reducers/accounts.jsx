import { createActions, createReducer } from 'reduxsauce';

export const { Types, Creators } = createActions({
  storeUser: ['user'],
  removeUser: null,
});

const INITIAL_STATE = {
  data: null,
};

const store = (state = INITIAL_STATE, action) => ({
  ...state,
  data: action.user,
});

const remove = (state = INITIAL_STATE) => ({
  ...state,
  data: null,
});

export default createReducer(INITIAL_STATE, {
  [Types.STORE_USER]: store,
  [Types.REMOVE_USER]: remove,
});
