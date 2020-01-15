export default (state = { uid: null, isSignedIn: null }, action) => {
    switch (action.type) {
        case "SET_USER": {
            return action.payload;
        }
        default:
            return state;
    }
};
