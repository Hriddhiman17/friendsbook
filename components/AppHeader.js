import React, { Component } from 'react';
import { View } from 'react-native';
import { Header } from 'react-native-elements';

export default class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }
  render() {
    return (
      <Header
        centerComponent={{
          text: this.props.title,
          style: { color: 'white', fontSize: 20, fontWeight: 'Bold' },
        }}
        backgroundColor="blue"
      />
    );
  }
}
