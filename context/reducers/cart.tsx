export function cart(state, action) {
    switch (action.type) {
        case 'CART':
            return { ...state, cart: action.payload }; 
        default:
            return state;
    }
}
