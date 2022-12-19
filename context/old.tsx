import { useReducer, createContext } from 'react';
import { user } from './reducers/user';
import { userID } from './reducers/userID';
import { connection } from './reducers/connection';
import { monthly_transactions } from './reducers/transactions';
import { accounts } from './reducers/accounts';
import { balance } from './reducers/balance';
import { bank_details } from './reducers/bank_details';
import { transaction_uri } from './reducers/transaction_uris';

// initial state
const initialState = {
    user: null,
    userID: null,
    connection: false,
    monthly_transactions: null,
    accounts: [],
    balance: null,
    bank_details: null,
    transaction_uri: ""
};

// create context
const Context = createContext({});

// combine reducer function
const combineReducers =
    (...reducers) =>
        (state, action) => {
            for (let i = 0; i < reducers.length; i++)
                state = reducers[i](state, action);
            return state;
        };

// context provider
const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(
        combineReducers(
            user,
            userID,
            connection,
            monthly_transactions,
            accounts,
            balance,
            bank_details,
            transaction_uri
        ),
        initialState
    );
    const value = { state, dispatch };

    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export { Context, Provider };
