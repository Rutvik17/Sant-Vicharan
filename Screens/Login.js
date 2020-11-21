import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Keyboard,
    ScrollView,
    KeyboardAvoidingView,
    TouchableOpacity
} from 'react-native'
import Svg, {Image, Circle, ClipPath} from 'react-native-svg';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Colors from "../Components/Colors";
import { currentUser } from "../Redux/Actions/Actions";
import { height, width } from "../Utils/utils";
import Animated, {Easing} from 'react-native-reanimated';
import { TapGestureHandler, State } from "react-native-gesture-handler";
import * as firebase from 'firebase';

interface Props {

}

const {Value,
    event,
    block,
    cond,
    eq,
    set,
    Clock,
    startClock,
    stopClock,
    debug,
    timing,
    clockRunning,
    interpolate,
    Extrapolate,
    concat } = Animated;

export function runTiming(clock, value, dest, duration?) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0)
    };

    const config = {
        duration: duration ? duration : 500,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease)
    };

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, dest),
            startClock(clock)
        ]),
        timing(clock, state, config),
        cond(state.finished, debug('stop clock', stopClock(clock))),
        state.position
    ]);
}

class Login extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            keyboardDidShow: false,
            bgY: -height / 2 - 50,
            formError: '',
            buttonName: ''
        };
        this.buttonOpacity = new Value(1);
        this.onButtonStateChange = event([
            {
                nativeEvent: ({ state }) => block([
                    cond(eq(state, State.END), set(this.buttonOpacity, runTiming(new Clock(), 1, 0)))
                ])
            }
        ]);

        this.onCloseState = event([
            {
                nativeEvent: ({ state }) => block([
                    cond(eq(state, State.END), set(this.buttonOpacity, runTiming(new Clock(), 0, 1)))
                ])
            }
        ]);

        this.bgY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [-height / 2 - 50, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.buttonY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [100, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.textInputIndex = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, -1],
            extrapolate: Extrapolate.CLAMP
        });

        this.textInputOpacity = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP
        });

        this.textInputY = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [0, 100],
            extrapolate: Extrapolate.CLAMP
        });

        this.rotateCross = interpolate(this.buttonOpacity, {
            inputRange: [0, 1],
            outputRange: [180, 360],
            extrapolate: Extrapolate.CLAMP
        });
    }

    componentDidMount(): void {
    }

    componentWillUnmount(): void {
    }

    onChangeEmail = (email) => {
        this.setState({email: email});
    };

    onChangePassword = (password) => {
        this.setState({password: password});
    };

    onEmailBlur = () => {
        this.setState({
            keyboardDidShow: false,
            bgY: -height / 2 - 50
        });
    };

    onPasswordBlur = () => {
        this.setState({
            keyboardDidShow: false,
            bgY: -height / 2 - 50
        });
    };

    onEmailFocus = () => {
        this.setState({
            keyboardDidShow: true,
            bgY: -height / 1.1 + 20,
        });
    };

    onPasswordFocus = () => {
        this.setState({
            keyboardDidShow: true,
            bgY: -height / 1.1 + 20,
        });
    };

    onLoginPress = async () => {
        try {
            await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
        } catch (e) {
            this.setState({formError: e.message})
        }
    };

    onSignUpPress = async () => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(
                this.state.email, this.state.password
            );
        } catch (e) {
            this.setState({formError: e.message})
        }
    };

    onPressClose = () => {
        this.resetForm();
    };

    resetForm = () => {
        this.setState({
            email: '',
            password: '',
            confirmPassword: '',
            formError: '',
            buttonName: ''
        });
        Keyboard.dismiss();
    };

    goToLogin = () => {
        this.setState({
           buttonName: 'login'
        });
    };

    render() {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex: 1}}
                enabled={true}
            >
                <Animated.View style={
                    {...StyleSheet.absoluteFill,
                        transform: [
                            {
                                translateY:
                                    (!this.state.keyboardDidShow && !this.state.updateBgY)
                                        ? this.bgY
                                        : interpolate(this.buttonOpacity, {
                                    inputRange: [0, 1],
                                    outputRange: [runTiming(new Clock(), this.state.bgY, -height / 1.1 + 20, 200), 0],
                                    extrapolate: Extrapolate.CLAMP
                                })
                            }
                        ]
                    }
                }>
                    <Svg height={height + 50} width={width}>
                        <ClipPath id={'clip'}>
                            <Circle r={height + 50} cx={width / 2} />
                        </ClipPath>
                        <Image
                            href={require('../assets/images/login.jpg')}
                            width={width}
                            height={height + 50}
                            preserveAspectRatio='xMidYMid slice'
                            clipPath='url(#clip)'
                        />
                    </Svg>
                </Animated.View>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={"handled"}
                            keyboardDismissMode={"on-drag"}>
                    <Animated.View style={{margin: 10, height: height / 3}}>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={this.goToLogin}>
                                <TapGestureHandler onHandlerStateChange={this.onButtonStateChange}>
                                    <Animated.View style={
                                        {...styles.button,
                                            opacity: this.buttonOpacity,
                                            transform: [{translateY: this.buttonY}]
                                        }
                                    }>
                                        <Text style={styles.buttonText}>
                                            Login
                                        </Text>
                                    </Animated.View>
                                </TapGestureHandler>
                            </TouchableOpacity>
                        </View>
                        <Animated.View style={{
                            zIndex: this.textInputIndex,
                            opacity: this.textInputOpacity,
                            transform: [{translateY: this.textInputY}],
                            height: height/2,
                            ...StyleSheet.absoluteFill,
                            top: null,
                            justifyContent: 'center'
                        }}>
                            <TouchableOpacity style={styles.closeButton} onPress={this.onPressClose}>
                                <TapGestureHandler onHandlerStateChange={this.onCloseState}>
                                    <Animated.View style={{
                                        height: 40,
                                        width: 40,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Animated.Text style={{...styles.buttonText, fontSize: 15, transform: [{rotate: concat(this.rotateCross, 'deg')}]}}>
                                            X
                                        </Animated.Text>
                                    </Animated.View>
                                </TapGestureHandler>
                            </TouchableOpacity>
                            <View>
                                {this.state.formError !== '' && (
                                    <Text style={
                                        {
                                            fontSize: 16,
                                            color: Colors.red,
                                            margin: 2,
                                            fontFamily: 'Roboto',
                                            alignSelf: 'center',
                                        }
                                    }>
                                        {this.state.formError}
                                    </Text>
                                )}
                                <TextInput
                                    placeholder={'Email'}
                                    value={this.state.email}
                                    onChangeText={this.onChangeEmail}
                                    onBlur={this.onEmailBlur}
                                    style={[
                                        {...styles.textInput}
                                    ]}
                                    onFocus={this.onEmailFocus}
                                    placeholderTextColor={Colors.black}
                                />
                                <TextInput
                                    placeholder={'Password'}
                                    value={this.state.password}
                                    onChangeText={this.onChangePassword}
                                    style={[
                                        {...styles.textInput}
                                    ]}
                                    onFocus={this.onPasswordFocus}
                                    secureTextEntry={true}
                                    onBlur={this.onPasswordBlur}
                                    placeholderTextColor={Colors.black}
                                />
                            </View>
                            <TouchableOpacity style={styles.button} onPress={this.onLoginPress}>
                                <Animated.View>
                                    <Text style={{
                                        ...styles.buttonText,
                                        marginVertical: 10
                                    }}>
                                        Login
                                    </Text>
                                </Animated.View>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    buttonsContainer: {
        justifyContent: 'center',
        height: height / 3
    },
    button: {
        backgroundColor: Colors.white,
        height: 70,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        shadowOffset: {width: 2, height: 2},
        shadowColor: 'black',
        shadowOpacity: 0.2
    },
    buttonText: {
        fontSize: 20,
        fontFamily: 'Roboto',
        fontWeight: '600'
    },
    textInput: {
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: 'rgba(0,0,0,0.2)',
        fontFamily: 'Roboto'
    },
    closeButton: {
        height: 40,
        width: 40,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        position: 'absolute',
        top: -10,
        left: (width / 2) - 30,
        shadowOffset: {width: 2, height: 2},
        shadowColor: 'black',
        shadowOpacity: 0.2
    }
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        currentUser: currentUser
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        user: state?.currentUser?.user
    }
}

export default connect(mapDispatchToProps, mapStateToProps)(Login);
