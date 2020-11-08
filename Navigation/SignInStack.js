import * as React from 'react'
import { Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from "../Screens/Home";
import Vicharan from "../Screens/Vicharan";
import Katha from "../Screens/Katha";
import Colors from "../Components/Colors";

const Tab = createBottomTabNavigator();

export default function SignInStack() {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName={Home}
               screenOptions={({ route }) => ({
                   tabBarIcon: ({ focused, color, size }) => {
                       let iconName;
                       if (route.name === 'Home') {
                           focused ? iconName = require('../assets/images/homeFocused.png')
                           : iconName = require('../assets/images/home.png');
                       } else if (route.name === 'Vicharan') {
                           focused ? iconName = require('../assets/images/vicharanFocused.png')
                               : iconName = require('../assets/images/vicharan.png');
                       } else {
                           focused ? iconName = require('../assets/images/kathaFocused.png')
                               : iconName = require('../assets/images/katha.png');
                       }
                       return <Image source={iconName} style={styles.image}/>;
                   },
               })}
               tabBarOptions={{
                   activeTintColor: Colors.orange,
                   inactiveTintColor: Colors.grey,
               }}
               backBehavior={'history'}
            >
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Vicharan" component={Vicharan} />
                <Tab.Screen name="Katha" component={Katha} />
            </Tab.Navigator>
        </NavigationContainer>
    )
};

const styles = StyleSheet.create({
    image: {
        resizeMode: 'contain',
        width: 30,
        height: 30
    }
});
