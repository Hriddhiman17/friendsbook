import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/AppHeader';
import firebase from 'firebase';
import db from '../config';

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      address: '',
      userId: firebase.auth().currentUser.email,
      contact: '',
      firstName: '',
      lastName: '',
      docId: '',
      image: '#',
    };
  }
  selectPic = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadingImage(uri, this.state.userId);
    }
  };
  uploadingImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase
      .storage()
      .ref()
      .child('userProfile/' + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };
  getUserProfile() {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            firstName: doc.data().first_name,
            lastName: doc.data().last_name,
            docId: doc.id,
            image: doc.data().profile_pic,
            address: doc.data().address,
            contact: doc.data().contact,
          });
        });
      });
  }
  updateUserDetails = () => {
    db.collection('users').doc(this.state.docId).update({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      address: this.state.address,
      contact: this.state.contact,
      profile_pic: this.state.image,
    });
    // ToastAndroid.show(
    //   'Profile Updated Successfully',
    //   ToastAndroid.SHORT,
    //   ToastAndroid.BOTTOM,
    //   25,
    //   50
    // );
    this.props.navigation.navigate('Home');
    return alert('Profile Updated Succesfully')
  };
  componentDidMount() {
    this.getUserProfile();
  }
  render() {
    return (
      <View style={styles.container}>
        <Header title={'Profile'} />
        <ScrollView style={{ width: '100%' }}>
          <View style={styles.avatarView}>
            <Avatar
              rounded
              source={{ uri: this.state.image }}
              size={'xlarge'}
              onPress={() => this.selectPic()}
            />
            <Text>{this.state.firstName + ' ' + this.state.lastName}</Text>
            <TextInput
              style={styles.inputBox}
              placeholder={'First Name'}
              value={this.state.firstName}
              onChangeText={(text) => {
                this.setState({ firstName: text });
              }}
            />
            <TextInput
              style={styles.inputBox}
              placeholder={'Last Name'}
              value={this.state.lastName}
              onChangeText={(text) => {
                this.setState({ lastName: text });
              }}
            />
            <TextInput style={styles.inputBox} value={this.state.userId} />
            <TextInput
              style={styles.inputBox}
              placeholder={'Address'}
              value={this.state.address}
              onChangeText={(text) => {
                this.setState({ address: text });
              }}
            />
            <TextInput
              style={styles.inputBox}
              placeholder={'Contact'}
              value={this.state.contact}
              onChangeText={(text) => {
                this.setState({ contact: text });
              }}
            />
            <TouchableOpacity
              style={styles.updateButton}
              onPress={this.updateUserDetails()}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dbdbdb',
  },
  avatarView: {
    alignItems: 'center',
  },
  inputBox: {
    width: '75%',
    height: 35,
    alignSelf: 'center',
    borderColor: 'blue',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  updateButton: {
    backgroundColor: 'blue',
    padding: 15,
    width: '75%',
    borderRadius: 30,
    textAlign: 'center',
    marginTop: 20,
  },
  buttonText: {
    alignSelf: 'center',
    fontSize: 22,
  },
});
