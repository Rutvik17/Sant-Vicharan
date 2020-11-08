import React, {useEffect, useState} from 'react';
import {
    StatusBar,
    StyleSheet,
    View,
    Image
} from 'react-native';
import * as firebase from 'firebase';
import firebaseConfig from './FirebaseConfig';
import {AppLoading, SplashScreen} from 'expo';
import {Provider} from "react-redux";
import {createStore} from "redux";
import allReducers from "./Redux/Reducers/Index";
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import SignOutStack from "./Navigation/SignOutStack";
import AuthNavigator, {AuthContext} from "./Navigation/AuthNavigator";
import SignInStack from "./Navigation/SignInStack";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

async function cacheImages(images) {
    for (let image of images) {
        if (typeof image === 'string') {
            return await Image.prefetch(image);
        } else {
            await Asset.fromModule(image).downloadAsync();
        }
    }
}

async function loadFonts(fonts) {
    await Font.loadAsync(fonts);
}

export default function App() {
    const [appReady, setAppReady] = useState(false);

    SplashScreen.preventAutoHide();

    const store = createStore(
        allReducers,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );

    const images = [
        require('./assets/images/login.jpg'),
        require('./assets/images/Sadhu/PujayTapovatsalSwami.jpg'),
        require('./assets/images/Sadhu/PujyaBrahmkirtanSwami.jpg'),
        require('./assets/images/Sadhu/PujayKirtanpremSwami.jpg'),
        require('./assets/images/Sadhu/PujyaAmrutswarupSwami.jpg'),
        require('./assets/images/Sadhu/PujyaNirdoshmuniSwami.jpg'),
        require('./assets/images/Sadhu/PujyaNityamuniSwami.jpg'),
        require('./assets/images/Sadhu/PujyaParamkirtiSwami.jpg'),
        require('./assets/images/Sadhu/PujyaPriyavratSwami.jpg'),
        require('./assets/images/Sadhu/PujyaRushimangalSwami.jpg'),
        require('./assets/images/Sadhu/PujyaRushinayanSwami.jpg'),
        require('./assets/images/Sadhu/PujyaShreejismaranSwami.jpg'),
        require('./assets/images/Sadhu/PujyaShrijisevaSwami.jpg'),
        require('./assets/images/Sadhu/PujyaVishwakirtiSwami.jpg'),
        require('./assets/images/Sadhu/PujyaYogimananSwami.jpg'),
        require('./assets/images/Sadhu/PujyaYogipurushSwami.jpg'),
    ];
    const fonts = {
        Roboto: require('./assets/Fonts/Roboto/Roboto-Regular.ttf')
    };

    Promise.all([cacheImages(images), loadFonts(fonts)]).then(() => {
        SplashScreen.hide();
        setAppReady(true);
    });

    if(appReady) {
        return (
            <Provider store={store}>
                <View style={styles.container}>
                    <StatusBar barStyle="dark-content"/>
                    <AuthNavigator/>
                </View>
            </Provider>
        );
    } else {
        return (
            <AppLoading />
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
