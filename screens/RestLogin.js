import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import Header from '../components/AppHeader';
import Loader from '../components/Loader';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import db from '../config';

export default class RestLogin extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      image: '#',
      docId: '',
      isLoading: false,
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
  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child('userProfile/' + imageName);
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({
          image: url,
        });
      })
      .catch((error) => {
        this.setState({
          image: '#',
        });
      });
  };
  getUserProfile() {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            docId: doc.id,
          });
        });
      });
  }
  addTheProfiePic = (image) => {
    db.collection('users')
      .doc(this.state.docId)
      .update({
        profile_pic: image,
      })
      .then(() => {
        this.props.navigation.navigate('Home');
        this.setState({ isLoading: true });
        alert('User Added Successfully');
      });
  };
  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }
  render() {
    const isTrue = this.state.isLoading;
    return isTrue ? (
      <Loader />
    ) : (
      <View style={{ flex: 1, backgroundColor: '#dbdbdb' }}>
        <Header title={'Choose your profile pic...'} />
        <View style={styles.container}>
          <Avatar
            rounded
            source={{ uri: this.state.image }}
            size={'xlarge'}
            onPress={() => this.selectPic()}
          />
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              this.addTheProfiePic(this.state.image);
            }}>
            <Text style={styles.nextButtonText}>{"Next >"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 5
  },
  nextButton: {
    backgroundColor: 'blue',
    borderRadius: 15,
    padding: 10,
    width: '75%',
    textAlign: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 23,
    alignSelf: 'center',
  },
});
