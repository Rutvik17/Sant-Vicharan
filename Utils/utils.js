import React, {Component} from 'react'
import { Dimensions } from 'react-native'

export const { width, height } = Dimensions.get('window');
export let  sadhus = [
    'Pujya Priyavrat Swami',
    'Pujya Brahmkirtan Swami',
    'Pujya Amrutswarup Swami',
    'Pujya Nityamuni Swami',
    'Pujya Paramkirti Swami',
    'Pujya Vishwakirti Swami',
    'Pujya Yogimanan Swami',
    'Pujya Nirdoshmuni Swami',
    'Pujya Rushimangal Swami',
    'Pujay Tapovatsal Swami',
    'Pujay Kirtanprem Swami',
    'Pujya Yogipurush Swami',
    'Pujya Rushinayan Swami',
    'Pujya Shrijiseva Swami',
    'Pujya Shreejismaran Swami'
];

export let sadhuIds = {
    admin: {
        name: 'Pujya Priyavrat Swami',
        email: 'admin@africa.baps.org'
    },
    bk: {
        name: 'Pujya Brahmkirtan Swami',
        email: 'bk@africa.baps.org'
    },
    spco: {
        name: 'Pujya Amrutswarup Swami',
        email: 'spco@africa.baps.org'
    },
    bkpco: {
        name: 'Pujya Nityamuni Swami ',
        email: 'bkpco@africa.baps.org'
    },
    ys: {
        name: 'Pujya Paramkirti Swami ',
        email: 'ys@africa.baps.org'
    },
    ys1: {
        name: 'Pujya Vishwakirti Swami',
        email: 'ys1@africa.baps.org'
    },
    bk1: {
        name: 'Pujya Yogimanan Swami ',
        email: 'bk1@africa.baps.org'
    },
    ys2: {
        name: 'Pujya Nirdoshmuni Swami ',
        email: 'ys2@africa.baps.org'
    },
    bk2: {
        name: 'Pujya Rushimangal Swami',
        email: 'bk2@africa.baps.org'
    },
    ys3: {
        name: 'Pujay Tapovatsal Swami ',
        email: 'ys3@africa.baps.org'
    },
    bk3: {
        name: 'Pujay Kirtanprem Swami',
        email: 'bk3@africa.baps.org'
    },
    ys4: {
        name: 'Pujya Yogipurush Swami',
        email: 'ys4@africa.baps.org'
    },
    bk4: {
        name: 'Pujya Rushinayan Swami',
        email: 'bk4@africa.baps.org'
    },
    sant02: {
        name: 'Pujya Shrijiseva Swami',
        email: 'sant02@africa.baps.org'
    },
    sant01: {
        name: 'Pujya Shreejismaran Swami',
        email: 'sant01@africa.baps.org'
    }
};

export const months = [{
    value: 'January',
}, {
    value: 'February',
}, {
    value: 'March',
}, {
    value: 'April',
}, {
    value: 'May',
}, {
    value: 'June',
}, {
    value: 'July',
}, {
    value: 'August',
}, {
    value: 'September',
}, {
    value: 'October',
}, {
    value: 'November',
}, {
    value: 'December',
}
];
