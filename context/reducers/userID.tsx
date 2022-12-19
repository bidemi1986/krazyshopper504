export function userID(state, action) {
	switch (action.type) {
		case 'USER_ID_AVAILABLE':
			return { ...state, userID: action.payload };
		case 'USER_ID_NULL':
			return { ...state, userID: action.payload };
		default:
			return state;
	}
}
