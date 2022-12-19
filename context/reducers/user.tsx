export function user(state, action) {
  switch (action.type) {
    case "ADD_DB_USER_DATA":
      return { ...state, user: action.payload.data, cart:action.payload.cart };
    case "USER_ID_TOKEN":
      return { ...state, user: action.payload };
    case "LOGGED_OUT_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}
