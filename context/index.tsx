import { useReducer, createContext } from "react";
import { user } from "./reducers/user";
import { userID } from "./reducers/userID";
import { connection } from "./reducers/connection";
import { balance } from "./reducers/balance";
import { cart } from "./reducers/cart";
import { products } from "./reducers/products";
const initialState = {
  user: null,
  userID: null,
  connection: false,
  transactions: "",
  balance: null,
  products: [],
  cart: [],
};
const createDataContext = (reducer, actions, initialState) => {
  const Context = createContext();
  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const boundActions = {};
    for (let key in actions) {
      // key ==="addBlogPost"
      boundActions[key] = actions[key](dispatch);
    }

    return (
      <Context.Provider
        value={{
          state,
          ...boundActions,
          dispatch,
        }}
      >
        {children}
      </Context.Provider>
    );
  };
  return { Context, Provider };
};

// combine reducer function
const combineReducers =
  (...reducers) =>
  (state, action) => {
    for (let i = 0; i < reducers.length; i++)
      state = reducers[i](state, action);
    return state;
  };

const checkNetworkConnection = (dispatch) => {
  return async () => {
    console.log("checking connection...");
    dispatch({
      type: "NETWORK",
      payload: true,
    });
  };
};
export const { Context, Provider } = createDataContext(
  combineReducers(user, userID, connection, balance, products, cart),
  {
    checkNetworkConnection,
  },
  initialState
);
