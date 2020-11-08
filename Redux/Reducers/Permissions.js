const permissions = (state = {}, action) => {
    switch (action.type) {
        case 'CAMERA_PERMISSIONS':
            return {
              ...state,
              permissions: {camera: action.load}
            };
        default:
            return state;
    }
};

export default permissions;
