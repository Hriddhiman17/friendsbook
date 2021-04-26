import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import firebase from 'firebase';

export default class PopUpMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  openMore = () => {
    return (
      <View>
        {this.state.visible === true ? (
          <View style={styles.moreContainer}>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => {
                this.setState({ visible: false }),
                firebase.auth().signOut()
              }}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => {
                this.setState({ visible: false });
              }}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    );
  };
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.setState({ visible: true });
          }}>
          <Icon name="more-vert" size={30} color={'black'} />
        </TouchableOpacity>
        {this.openMore()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  moreContainer: {
    borderRadius: 5,
    padding: 5,
    marginRight: 60,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10.32,
    elevation: 16,
  },
  moreButton: {
    margin: 5,
  },
  buttonText: {
    fontSize: 18,
  },
});
