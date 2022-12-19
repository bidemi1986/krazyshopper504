export function transactions(state, action) {
    switch (action.type) {
        case 'SELECTED_TRANSACTION_KEY':
            return { ...state, transactions: action.payload };
        default:
            return state;
    }
}
