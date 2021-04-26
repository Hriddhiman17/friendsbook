import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AppHeader from './AppHeader';

export default class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonColor: 'blue',
    };
  }
  changeColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    this.setState({ buttonColor: color });
  };
  componentDidMount() {
    setInterval(() => {
      this.changeColor();
    }, 1000);
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator
            animating={true}
            size="large"
            color={this.state.buttonColor}
          />
          <Text
            style={{
              color: this.state.buttonColor,
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            Please Wait
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    opacity: 0.9,
  },
});
