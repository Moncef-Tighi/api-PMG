const loadingReducer = function(state, {type}) {
    let newState= {...state}
    switch(type) {
        case 'plateforme' :
            newState.plateforme= true
            return newState
        case 'wooCommerce' : 
            newState.wooCommerce= true;
            return newState
        case 'variation' :
            newState.variation=true;
            return newState
        case 'activation' :
            newState.activation=true;
            return newState
        case 'reset':
            newState= {...initialState};
            return newState
    }
    return newState
}

export default loadingReducer