import React, {Component} from "react";
import {View, StyleSheet, SafeAreaView, Text} from "react-native";

class Katha extends Component<Props, State> {
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View>
                    <Text style={{fontSize: 32,color: 'rgba(0,0,0,0.4)'}}>
                        Coming Soon
                    </Text>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center'
    }
});

export default Katha;
