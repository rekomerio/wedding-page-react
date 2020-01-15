export default (state = { isLoading: false }, action) => {
    switch (action.type) {
        case "SET_LOADING": {
            return action.payload;
        }
        default:
            return state;
    }
};
