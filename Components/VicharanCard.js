import React, {Component} from 'react'
import {
    LayoutAnimation,
    Animated,
    Dimensions,
    Text,
    View,
    StyleSheet,
    ScrollView,
    Modal, TouchableWithoutFeedback, TouchableOpacity, TextInput, KeyboardAvoidingView
} from 'react-native';
import Colors from "./Colors";
import * as firebase from "firebase";
const { width, height } = Dimensions.get('window');
const smallSize = width / 5;
const itemWidth = width * .67;
const itemHeight = 310;
const fontSize=  100;

const COLORS = [
    'coral',
    'mediumturquoise',
    'palevioletred',
    'papayawhip',
    'tomato',
    Colors.pink,
    Colors.yellow,
    Colors.orange
];

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

interface Props {
    data: any,
    month: string,
    jodi: string,
    refresh: any
}

interface State {
    scrollX: any;
    indicator: any;
    modalVisible: boolean,
    breakfastInputValue: string,
    lunchInputValue: string,
    nightInputValue: string,
    sabhaInputValue: string,
    vicharanDateToEdit: number
}

class VicharanCard extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            scrollX: new Animated.Value(0),
            indicator: new Animated.Value(1),
            modalVisible: false,
            breakfastInputValue: '',
            lunchInputValue: '',
            nightInputValue: '',
            sabhaInputValue: '',
            vicharanDateToEdit: null
        }
    }

    componentDidMount() {
        LayoutAnimation.spring()
    }

    editVicharanData = (vicharan, date) => {
        this.setState({
            breakfastInputValue: vicharan.data.breakfast,
            lunchInputValue: vicharan.data.lunch,
            nightInputValue: vicharan.data.night,
            sabhaInputValue: vicharan.data.sabha,
            vicharanDateToEdit: date
        })
    };

    onUpdateVicharanDetails = async () => {
        let year = new Date().getUTCFullYear().toString();
        let vicharan;
        let month = this.props.month.toLocaleLowerCase();
        await firebase.database().ref('/vicharan/'
            + year + '/' + month + '/' + this.props.jodi + '/' + this.state.vicharanDateToEdit
        ).update({
            breakfast: this.state.breakfastInputValue,
            lunch: this.state.lunchInputValue,
            night: this.state.nightInputValue,
            sabha: this.state.sabhaInputValue
        }, (error) => {
            if (error) {
                console.log(error);
            } else {
                this.props.refresh();
                // saved successfully
            }
        });
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    };

    render() {
        let upcomingVicharanData = [];
        let previousVicharanData = [];
        let vicharanSummary = [];
        let currentMonth = new Date().getUTCMonth();
        let selectedMonth = null;
        dropdownData.map((month, index) => {
            if (month.value.toLocaleLowerCase() === this.props.month.toLocaleLowerCase()) {
                selectedMonth = index;
            }
        });
        this.props.data?.map((result, i) => {
            for (let vicharan in result.vicharan) {
                let currentDate = new Date().getUTCDay();
                let vicharanDate = parseInt(vicharan);
                if (currentMonth <= selectedMonth) {
                    if (currentDate < vicharanDate) {
                        upcomingVicharanData.push({date: vicharan, data: result.vicharan[vicharan]})
                    } else {
                        previousVicharanData.push({date: vicharan, data: result.vicharan[vicharan]})
                    }
                } else {
                    previousVicharanData.push({date: vicharan, data: result.vicharan[vicharan]})
                }
            }
        });
        let vicharanSummaryObject = {
            upcomingVicharans: {
                title: 'Total Upcoming Vicharan',
                subtitle: 'Current Month',
                count: upcomingVicharanData.length
            },
            previousVicharans: {
                title: 'Total Previous Vicharan',
                subtitle: 'Current Month',
                count: previousVicharanData.length
            },
            totalVicharan: {
                title: 'Total Vicharan',
                subtitle: 'Current Month',
                count: upcomingVicharanData.length + previousVicharanData.length
            }
        };
        for (let r in vicharanSummaryObject) {
            vicharanSummary.push(r);
        }
        return this.props.data ? (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {}}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{flex: 1}}
                        enabled={true}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>
                                    Details
                                </Text>
                                <View style={styles.modalForm}>
                                    <Text style={{
                                        fontSize: 16,
                                        marginHorizontal: 5
                                    }}>
                                        Breakfast
                                    </Text>
                                    <TextInput
                                        placeholder={'Breakfast'}
                                        value={this.state.breakfastInputValue}
                                        style={[
                                            {...styles.textInput}
                                        ]}
                                        onChangeText={(value) => {
                                            this.setState({
                                                breakfastInputValue: value,
                                                lunchInputValue: value,
                                                nightInputValue: value,
                                                sabhaInputValue: value,
                                            })
                                        }}
                                        placeholderTextColor={Colors.black}
                                    />
                                    <Text style={{
                                        fontSize: 16,
                                        marginHorizontal: 5
                                    }}>
                                        Lunch
                                    </Text>
                                    <TextInput
                                        placeholder={'Lunch'}
                                        value={this.state.lunchInputValue}
                                        style={[
                                            {...styles.textInput}
                                        ]}
                                        onChangeText={(value) => {
                                            this.setState({
                                                lunchInputValue: value,
                                                sabhaInputValue: value,
                                                nightInputValue: value
                                            })
                                        }}
                                        placeholderTextColor={Colors.black}
                                    />
                                    <Text style={{
                                        fontSize: 16,
                                        marginHorizontal: 5
                                    }}>
                                        Night
                                    </Text>
                                    <TextInput
                                        placeholder={'Night'}
                                        value={this.state.nightInputValue}
                                        style={[
                                            {...styles.textInput}
                                        ]}
                                        onChangeText={(value) => {
                                            this.setState({
                                                nightInputValue: value,
                                            })
                                        }}
                                        placeholderTextColor={Colors.black}
                                    />
                                    <Text style={{
                                        fontSize: 16,
                                        marginHorizontal: 5
                                    }}>
                                        Sabha
                                    </Text>
                                    <TextInput
                                        placeholder={'Sabha'}
                                        value={this.state.sabhaInputValue}
                                        style={[
                                            {...styles.textInput}
                                        ]}
                                        onChangeText={(value) => {
                                            this.setState({
                                                sabhaInputValue: value,
                                                nightInputValue: value,
                                            })
                                        }}
                                        placeholderTextColor={Colors.black}
                                    />
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity
                                        style={{
                                            ...styles.openButton,
                                            backgroundColor: "#2196F3",
                                            width: 120,
                                            height: 50,
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => {
                                            this.setState({
                                                modalVisible: !this.state.modalVisible
                                            })
                                        }}
                                    >
                                        <Text style={styles.textStyle}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            ...styles.openButton,
                                            backgroundColor: "#2196F3",
                                            width: 120,
                                            height: 50,
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => {
                                            this.onUpdateVicharanDetails()
                                        }}
                                    >
                                        <Text style={styles.textStyle}>
                                            Update
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
                <View style={{}}>
                    <Text style={[styles.heading, {fontSize: 28, color: Colors.black}]}>Upcoming Vicharan</Text>
                    {this.renderScroll(upcomingVicharanData)}
                    <Text style={[styles.heading, {fontSize: 28, color: Colors.black}]}>Previous Vicharan</Text>
                    {this.renderScroll(previousVicharanData)}
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.heading}>Summary</Text>
                    <ScrollView contentContainerStyle={{alignItems: 'flex-start'}} style={{paddingHorizontal: 10, flex: 1, width: width}}>
                        {vicharanSummary.map((vicharan,i) => {
                            return this.renderNormal(vicharanSummaryObject, vicharan, i)
                        })}
                    </ScrollView>
                </View>
            </View>
        ) : (
            <View style={styles.container}>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 20
                }}>
                    <Text style={{fontSize: 32, color: 'rgba(0,0,0,0.4)'}}>
                        Select Jodi
                    </Text>
                </View>
            </View>
        );
    }

    renderScroll(data) {
        return <Animated.ScrollView
            horizontal={true}
            style={{flex: 1}}
            contentContainerStyle={{alignItems: 'center', flexGrow: 1}}
            decelerationRate={0}
            snapToInterval={itemWidth}
            scrollEventThrottle={16}
            snapToAlignment="start"
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: this.state.scrollX } } }]
            )}
        >
            {data && data.length > 1 && data.map((result, i) => {
                    return this.renderRow(result, i);
                })
            }
            {data && data.length < 1  && (
                <View style={styles.vicharanDetails}>
                    <Text style={styles.details}>
                        No Results
                    </Text>
                </View>
            )}
        </Animated.ScrollView>
    }

    renderNormal(data, vicharan, i) {
        if (!data[vicharan]) {
            return null
        }
        return <View key={i}  style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 20}}>
            <View style={[{
                height: smallSize,
                width: smallSize,
                opacity: 1,
                backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
                justifyContent: 'center',
            }]}>
                <Text style={{fontSize: 36,color: 'rgba(0,0,0,0.4)', alignSelf: 'center'}}>
                    {data[vicharan].count}
                </Text>
            </View>
            <View style={{marginLeft: 20}}>
                <Text style={{fontWeight: '600', fontSize: 16, color: Colors.black}}>
                    {data[vicharan].title}
                </Text>
                <Text style={{fontWeight: '300', fontSize: 12, color: Colors.black}}>
                    {data[vicharan].subtitle}
                </Text>
            </View>
        </View>
    }

    renderRow(result, i) {
        let inputRange = [(i - 1) * itemWidth, i * itemWidth, (i + 1) * itemWidth, (i + 2) * itemWidth];
        let secondRange = [(i - 1) * itemWidth, i * itemWidth, (i + 1) * itemWidth];

        // Ensure that we're leaving space for latest item.
        if (!result) {
            return <View key={i} style={[styles.emptyItem, {width: width * .33}]} />
        }

        return (
            <TouchableWithoutFeedback onPress={() => {
                this.editVicharanData(result, result.date);
                this.setState({
                    modalVisible: true
                })
            }} key={i}>
            <Animated.View key={i} style={[styles.emptyItem, {
                opacity: this.state.scrollX.interpolate({
                    inputRange: secondRange,
                    outputRange: [.3, 1, 1]
                }),
                height: this.state.scrollX.interpolate({
                    inputRange: secondRange,
                    outputRange: [itemHeight * .8, itemHeight, itemHeight],
                })
            }]}>
                <View style={styles.vicharanDetails}>
                    <Text style={styles.day}>
                        {result.data.day}
                    </Text>
                    <Text style={styles.details}>
                        Breakfast: {' ' + result.data.breakfast}
                    </Text>
                    <Text style={styles.details}>
                        Lunch: {' ' + result.data.lunch}
                    </Text>
                    <Text style={styles.details}>
                        Night: {' ' + result.data.night}
                    </Text>
                    <Text style={styles.details}>
                        Sabha: {' ' + result.data.sabha}
                    </Text>
                    <Text style={styles.details}>
                        Remarks: {' ' + result.data.remarks}
                    </Text>
                    <Text style={styles.editText}>
                        Edit
                    </Text>
                </View>
                <View key={i} style={[
                    StyleSheet.absoluteFill,
                    {
                        height: itemHeight,
                        width: itemWidth,
                        opacity: 1,
                    }
                ]}>
                    <View style={[StyleSheet.absoluteFill, {opacity: 0.4, backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)], width: itemWidth, height: itemHeight}]} />
                    <Animated.View
                        style={[{
                            width: itemWidth,
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            flex: 1,
                            position: 'relative',
                            height: itemHeight,
                            opacity: this.state.scrollX.interpolate({
                                inputRange,
                                outputRange: [0.4,1, 1, 1]
                            }),
                            transform: [{
                                scale: this.state.scrollX.interpolate({
                                    inputRange,
                                    outputRange: [.5, 1, 1.4, 1]
                                })
                            }]
                        }]}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', width: itemWidth, height: itemHeight, position: 'absolute', bottom: -itemHeight / 4, right: -itemWidth / 4}}>
                            <Text style={{fontSize: fontSize,color: 'rgba(0,0,0,0.4)'}}>{result.date}</Text>
                        </View>
                    </Animated.View>
                </View>
            </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    emptyItem: {
        overflow: 'hidden',
        height: itemHeight,
        flex: 1,
        borderLeftWidth: 20,
        borderColor: Colors.black,
        width: itemWidth,
        backgroundColor: 'transparent'
    },
    heading: {
        fontSize: 22,
        fontWeight: '300',
        alignSelf: 'flex-start',
        paddingVertical: 10,
    },
    vicharanDetails: {
        marginHorizontal: 5
    },
    day: {
        fontSize: 42,
        color: Colors.black,
    },
    details: {
        marginVertical: 5,
        fontSize: 20,
        color: Colors.black,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        height: height - 120,
        width: width,
        margin: 10,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        margin: 10
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        fontSize: 22,
        marginBottom: 15,
        textAlign: "center"
    },
    detailsEdit: {
        backgroundColor: Colors.grey,
        height: 35,
        width: 50,
        borderRadius: 5,
        marginVertical: 5,
        alignSelf: 'flex-start',
        justifyContent: 'center',
        shadowOffset: {width: 2, height: 2},
        shadowColor: 'black',
        shadowOpacity: 0.2
    },
    editText: {
        textAlign: 'center',
        fontSize: 24,
        color: Colors.black,
        fontWeight: '600'
    },
    modalForm: {
        paddingHorizontal: 2
    },
    textInput: {
        width: itemWidth - 10,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: 'rgba(0,0,0,0.2)',
        fontFamily: 'Roboto'
    },
});

export default VicharanCard;
