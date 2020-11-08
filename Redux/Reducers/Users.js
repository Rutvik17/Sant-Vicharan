const initialState = {
    user: {},
    vicharanJodis: {},
    vicharan: {},
    vicharanPerJodi: {}
};

const currentUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CURRENT_USER':
            return {
                ...state,
                user: action.load
            };
        case 'VICHARAN_JODIS':
            return {
                ...state,
                vicharanJodis: action.load
            };
        case 'VICHARAN':
            return {
                ...state,
                vicharan: action.load
            };
        case 'VICHARAN_PER_JODI':
            let vicharanPerJodi = state.vicharanPerJodi;
            vicharanPerJodi[action.load.jodi] = action.load.vicharan;
            return {
                ...state,
                vicharanPerJodi: vicharanPerJodi
            };
        default:
            return {
                ...state,
            };
    }
};

export default currentUserReducer;
