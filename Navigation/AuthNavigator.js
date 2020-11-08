import React, { useState, useEffect, createContext } from 'react';
import * as firebase from "firebase";
import SignInStack from './SignInStack';
import SignOutStack from './SignOutStack';
import { useDispatch } from 'react-redux';

export const AuthContext = createContext(null);

/**
 * @return {null}
 */

export default function AuthNavigator() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();
    // Handle user state changes
    function onAuthStateChanged(result) {
        setUser(result);
        dispatch({type: 'CURRENT_USER', load: result});
        if (initializing) setInitializing(false)
    }

    useEffect(() => {
        const authSubscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);

        // unsubscribe on unmount
        return authSubscriber;
    }, []);

    if (initializing) {
        return null;
    }

    return user ? (
        <AuthContext.Provider value={user}>
            <SignInStack />
        </AuthContext.Provider>
    ) : (
        <SignOutStack />
    )
}
