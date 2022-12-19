export function balance(state, action) {
    switch (action.type) {
        case 'CURRENT_BALANCE':
            return { ...state, balance: action.payload };
        default:
            return state;
    }
}
