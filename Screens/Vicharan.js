import React, {Component} from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    Text,
    RefreshControl,
    KeyboardAvoidingView
} from 'react-native';
import {bindActionCreators} from "redux";
import {currentUser} from "../Redux/Actions/Actions";
import {connect} from "react-redux";
import * as firebase from "firebase";
import {sadhuIds} from "../Utils/utils";
import Colors from "../Components/Colors";
import { Dropdown } from 'react-native-material-dropdown-v2';
import VicharanCard from "../Components/VicharanCard";

interface Props {
    user?: any;
}

interface State {
    month: string,
    vicharan: any,
    jodis: any,
    jodi: string,
    vicharanData: any,
    processedVicharanData: any,
    jodiDropDown: any,
    refresh: true
}

const dropdownData = [{
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

class Vicharan extends Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            month: dropdownData[new Date().getUTCMonth()].value,
            vicharan: null,
            jodis: null,
            jodi: '',
            vicharanData: null,
            processedVicharanData: null,
            jodiDropDown: [],
            refresh: false
        }
    }

    async componentDidMount(): void {
        await this.fetchData();
    }

    fetchData = async () => {
        let year = new Date().getUTCFullYear().toString();
        let vicharan;
        let jodis;
        let month = this.state.month.toLocaleLowerCase();
        await firebase.database().ref('/vicharan/' + year + '/' + month).once('value').then(function(snapshot) {
            vicharan = snapshot.val();
        });
        this.renderVicharan(vicharan).then((value) => {
            this.jodiDropdownMenu(value);
            jodis = value;
            this.setState({
                jodis: value
            });
        });
        this.setState({
            vicharan: vicharan
        });
        return {
            jodis: jodis,
            vicharan: vicharan,
        };
    };

    onMonthChange = async (month) => {
        this.setState({
           month: month,
            jodi: '',
            processedVicharanData: null
        });
        await this.fetchData();
    };

    jodiDropdownMenu = (value) => {
        let jodiDropDown = [];
        if (value && value.length) {
            value.map((jodi) => {
                jodiDropDown.push({value: jodi});
            })
        }
        this.setState({
           jodiDropDown: jodiDropDown
        });
    };

    onJodiChange = (value) => {
        this.setState({
            jodi: value,
            vicharanData: this.state.vicharan[value]
        });
        this.processDataToRender();
    };

    renderVicharan = async (vicharan) => {
        let user = this.props.user.email.substr(0, this.props.user.email.indexOf('@'));
        let jodis = [];

        for (let jodi in vicharan) {
            if (jodi.includes(user)) {
                jodis.push(jodi);
            }
        }

        return jodis;
    };

    processDataToRender = () => {
        let data = [];
        data.push({vicharan: this.state.vicharanData, names: this.state.jodi?.split('&')});
        let i = 0;
        for (let name of data) {
            let a = [];
            for (let r of name?.names) {
                r = sadhuIds[r]?.name;
                a.push(r);
            }
            data[i] = {vicharan: this.state.vicharanData, names: a};
            i++;
        }
        this.setState({
            processedVicharanData: data
        });
    };

    onRefresh = () => {
        this.setState({
            refresh: true
        });
        this.fetchData().then((value) => {
            this.setState({
                vicharan: value.vicharan,
                vicharanData: this.state.vicharan?.[this.state?.jodi],
                refresh: false
            });
            this.processDataToRender();
        }, (error) => {
            console.log(error);
            this.setState({
                refresh: false
            });
        });
    };

    render() {
        let names = [];
        this.state.processedVicharanData?.map(result => {
            result.names.map((name) => {
                names.push(name);
            })
        });
        let namesView = names.map((name, i) => {
            return (
                <View key={i}>
                    <Text style={styles.jodiText}>
                        {name}
                    </Text>
                </View>
            )
        });
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex: 1}}
                enabled={true}
            >
                <SafeAreaView style={styles.container}>
                    <ScrollView contentContainerStyle={{}}
                                keyboardShouldPersistTaps={"handled"}
                                keyboardDismissMode={"on-drag"}
                                horizontal={false}
                                refreshControl={
                                    <RefreshControl refreshing={this.state.refresh} onRefresh={this.onRefresh} />
                                }
                    >
                        <View style={styles.contentView}>
                            <View style={styles.vicharanViewContainer}>
                                <View style={styles.jodiContainer}>
                                    <Text style={{
                                        ...styles.jodiText,
                                        color: 'rgba(0,0,0,0.4)',
                                        fontSize: 36
                                    }}>
                                        {new Date().toLocaleDateString()}
                                    </Text>
                                    <Text style={styles.jodiText}>
                                        Vicharan
                                    </Text>
                                    {namesView}
                                </View>
                            </View>
                            <Dropdown
                                label='Select Month'
                                data={dropdownData}
                                baseColor={Colors.black}
                                textColor={Colors.black}
                                itemColor={Colors.black}
                                selectedItemColor={Colors.orange}
                                value={this.state.month}
                                onChangeText={this.onMonthChange}
                                dropdownOffset={{top: 32, left: 0}}
                            />
                            <Dropdown
                                label='Select Jodi'
                                data={this.state.jodiDropDown}
                                baseColor={Colors.black}
                                textColor={Colors.black}
                                itemColor={Colors.black}
                                selectedItemColor={Colors.orange}
                                value={this.state.jodi}
                                onChangeText={this.onJodiChange}
                                dropdownOffset={{top: 32, left: 0}}
                            />
                            <View style={styles.vicharanViewContainer}>
                                <VicharanCard
                                    data={this.state.processedVicharanData}
                                    month={this.state.month}
                                    jodi={this.state.jodi}
                                    refresh={this.onRefresh}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        justifyContent: 'flex-start'
    },
    text: {
        color: Colors.black,
        fontSize: 24,
        alignSelf: 'center'
    },
    contentView: {
        width: '100%',
        padding: 5,
        margin: 5,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    dataWrapper: { marginTop: -1 },
    row: { height: 40, backgroundColor: '#E7E6E1' },
    header: { height: 50, backgroundColor: '#537791' },
    vicharanViewContainer: {
        marginHorizontal: 20
    },
    jodiContainer: {
        width: '100%',
    },
    jodiText: {
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 26,
        color: Colors.black
    },

});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        currentUser: currentUser,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        user: state.currentUser.user,
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Vicharan);
