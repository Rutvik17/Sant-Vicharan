import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    Button,
    KeyboardAvoidingView,
    Animated,
    TextInput,
    ScrollView,
    Text,
    TouchableOpacity,
    SafeAreaView, StatusBar, Image, RefreshControl
} from 'react-native'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import { currentUser } from "../Redux/Actions/Actions";
import * as firebase from "firebase";
import Colors from "../Components/Colors";
import {months, sadhuIds, width} from "../Utils/utils";
import { sadhus } from "../Utils/utils";

interface Props {
    currentUser?: any;
    user?: any;
}

interface State {
    name: string,
    user: string,
    sadhu: any;
    refresh: boolean,
    location: any
}

class Home extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            user: this.props.user,
            sadhu: [],
            refresh: false,
            location: null
        };
    }

    async componentDidMount(): void {
        let array = [];
        await firebase.database().ref('/sadhu/').once('value').then(function(snapshot) {
            let sadhu = snapshot.val();
            for (let r of sadhus) {
                array.push(sadhu[r]);
            }
        });
        await this.getLocation();
        this.setState({
            sadhu: array
        });
    }

    getLocation = async () => {
        let vicharan =  await this.fetchCurrentMonthVicharan();
        let currentDate = new Date().getUTCDay().toString();
        let locations = [];
        for (let r in vicharan) {
            for (let v in vicharan[r]) {
                if (v === currentDate) {
                    locations.push({sadhu: r, vicharanDetails: vicharan[r][v]})
                }
            }
        }
        locations.map((details) => {
            let a = {};
            let sadhus = details?.sadhu.split('&');
            let currentTime = new Date().getHours();
            for (let name of sadhus) {
                name = sadhuIds[name]?.name;
                a[name] = {
                    location: currentTime < 9 ? details?.vicharanDetails?.breakfast
                        : currentTime < 13 ? details?.vicharanDetails?.lunch
                        : currentTime < 21 ? details?.vicharanDetails?.sabha
                        : currentTime < 22 ? details?.vicharanDetails?.night
                        : 'Nairobi'
                };
            }
            this.setState({
                location: a
            })
        });
    };

    fetchCurrentMonthVicharan = async () => {
        let year = new Date().getUTCFullYear().toString();
        let month = months[new Date().getUTCMonth()].value.toLocaleLowerCase();
        let vicharan;
        await firebase.database().ref('/vicharan/'
            + year + '/' + month
        ).once('value').then(function(snapshot) {
            vicharan = snapshot.val();
        });
        return vicharan;
    };

    submitName = async() => {
        try {
            await firebase.auth().currentUser.updateProfile({
                displayName: this.state.name
            });
            await firebase.database().ref('sadhu/' + this.state.name).set({
                email: this.props.user.email,
                displayName: this.props.user.displayName,
                uid: this.props.user.uid
            });
            let user = firebase.auth().currentUser;
            this.setState({user: user});
            this.props.currentUser(user);
        } catch (e) {
        }
    };

    onLogout = () => {
        firebase.auth().signOut();
    };

    matchImages = (item) => {
        switch (item.displayName) {
            case 'Pujya Priyavrat Swami':
                return require('../assets/images/Sadhu/PujyaPriyavratSwami.jpg');
            case 'Pujya Brahmkirtan Swami':
                return require('../assets/images/Sadhu/PujyaBrahmkirtanSwami.jpg');
            case 'Pujya Amrutswarup Swami':
                return require('../assets/images/Sadhu/PujyaAmrutswarupSwami.jpg');
            case 'Pujya Nityamuni Swami':
                return require('../assets/images/Sadhu/PujyaNityamuniSwami.jpg');
            case 'Pujya Paramkirti Swami':
                return require('../assets/images/Sadhu/PujyaParamkirtiSwami.jpg');
            case 'Pujya Vishwakirti Swami':
                return require('../assets/images/Sadhu/PujyaVishwakirtiSwami.jpg');
            case 'Pujya Yogimanan Swami':
                return require('../assets/images/Sadhu/PujyaYogimananSwami.jpg');
            case 'Pujya Nirdoshmuni Swami':
                return require('../assets/images/Sadhu/PujyaNirdoshmuniSwami.jpg');
            case 'Pujya Rushimangal Swami':
                return require('../assets/images/Sadhu/PujyaRushimangalSwami.jpg');
            case 'Pujay Tapovatsal Swami':
                return require('../assets/images/Sadhu/PujayTapovatsalSwami.jpg');
            case 'Pujay Kirtanprem Swami':
                return require('../assets/images/Sadhu/PujayKirtanpremSwami.jpg');
            case 'Pujya Yogipurush Swami':
                return require('../assets/images/Sadhu/PujyaYogipurushSwami.jpg');
            case 'Pujya Rushinayan Swami':
                return require('../assets/images/Sadhu/PujyaRushinayanSwami.jpg');
            case 'Pujya Shrijiseva Swami':
                return require('../assets/images/Sadhu/PujyaShrijisevaSwami.jpg');
            case 'Pujya Shreejismaran Swami':
                return require('../assets/images/Sadhu/PujyaShreejismaranSwami.jpg');
            default:
                return require('../assets/images/Sadhu/PujyaPriyavratSwami.jpg');
        }
    };

    onSwamiClick = async (swami) => {

    };

    onRefresh = () => {
        this.setState({
            refresh: true
        });
        this.getLocation().then(() => {
            this.setState({
                refresh: false
            });
        }, () => {
            this.setState({
                refresh: false
            });
        });
    };

    render() {
        if (this.props.user && !this.props.user.displayName) {
            return (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{flex: 1}}
                    enabled={true}
                >
                    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps={"handled"}
                                keyboardDismissMode={"on-drag"}
                    >
                        <Animated.View style={{width: width}}>
                            <TextInput
                                placeholder={'Name'}
                                style={[
                                    {...styles.textInput}
                                ]}
                                placeholderTextColor={Colors.black}
                                onChangeText={(name) => this.setState({name: name})}
                            />
                        </Animated.View>
                        <TouchableOpacity onPress={this.submitName}>
                            <Animated.View style={{...styles.button, width: width - 40}}>
                                <Text style={{
                                    ...styles.buttonText,
                                    marginVertical: 10
                                }}>
                                    Submit
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            )
        } else {
            let sadhuView = this.state.sadhu.map((sadhu, index) => {
                    let image = this.matchImages(sadhu);
                    return (
                        <TouchableOpacity onPress={() => this.onSwamiClick(sadhu)} key={index+3}>
                            <View
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <View>
                                    <View style={{ height: 100, width: 100, margin: 10 }} key={index+1}>
                                        <Image source={image} // Use item to set the image source
                                               key={index+2}
                                               style={{
                                                   flex: 1,
                                                   width:100,
                                                   height:100,
                                                   resizeMode:'cover',
                                                   borderRadius: 50,
                                                   padding: 10
                                               }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{
                                            flexDirection: 'row',
                                            alignSelf: 'center',
                                            paddingVertical: 5,
                                            fontSize: 18
                                        }}>
                                            {
                                                this.state.location &&
                                                this.state.location[sadhu.displayName] ?
                                                this.state.location[sadhu.displayName].location : 'Nairobi'
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                });

            return (
                <SafeAreaView style={styles.container}>
                    <ScrollView contentContainerStyle={{}} keyboardShouldPersistTaps={"handled"}
                                keyboardDismissMode={"on-drag"}
                                refreshControl={
                                    <RefreshControl refreshing={this.state.refresh} onRefresh={this.onRefresh} />
                                }
                    >
                        <View style={{ height: 'auto', flexDirection: 'row', justifyContent:'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
                            {sadhuView}
                        </View>
                        <View style={{margin: 2.5, padding: 2.5}}>
                            <Button title={'logout'} onPress={this.onLogout}/>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        marginTop: StatusBar.currentHeight || 0,
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
    buttonText: {
        fontSize: 20,
        fontFamily: 'Roboto',
        fontWeight: '600'
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
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        currentUser: currentUser.user
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        user: state.currentUser.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
