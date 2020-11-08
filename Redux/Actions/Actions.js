export const currentUser = (load) => {
    return {
        type: 'CURRENT_USER',
        load: load
    };
};

export const vicharanJodis = (load) => {
    return {
        type: 'VICHARAN_JODIS',
        load: load
    }
};

export const vicharan = (load) => {
    return {
        type: 'VICHARAN',
        load: load
    }
};

export const vicharanPerJodi = (load) => {
    return {
        type: 'VICHARAN_PER_JODI',
        load: load
    }
};
