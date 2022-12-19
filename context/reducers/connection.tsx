export function connection(state, action) {
    switch (action.type) {
        case 'NETWORK':
            return { ...state, connection: action.payload };
        case 'NO_NETWORK':
            return { ...state, connection: action.payload };
        default:
            return state;
    }
}
