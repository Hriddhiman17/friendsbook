import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ToastAndroid,
  KeyboardAvoidingView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import db from '../config';

export default class Share extends Component {
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
      about: '',
      uniqueId: '',
      profile_pic: '#',
    };
  }
  selectPic = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
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
      .child('images/' + imageName + '/' + global.uuid);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };
  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child('images/' + imageName + '/' + global.uuid);
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
            firstName: doc.data().first_name,
            lastName: doc.data().last_name,
            docId: doc.id,
            image: doc.data().image_link,
            address: doc.data().address,
            contact: doc.data().contact,
            uniqueId: doc.data().uniqueId,
            profile_pic: doc.data().profile_pic
          });
        });
      });
  }
  componentDidMount() {
    this.createUniqueId();
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }
  createUniqueId() {
    var uId = Math.random().toString(36).substring(7);
    this.setState({ uniqueId: uId });
    global.uuid = uId;
    return uId;
  }
  addPost = () => {
    db.collection('posts').add({
      image_link: this.state.image,
      name: this.state.firstName + ' ' + this.state.lastName,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      about: this.state.about,
      uniqueId: global.uuid,
      user_profile_pic: this.state.profile_pic,
      email_id: this.state.userId,
      likes: 0
    });
    // ToastAndroid.show(
    //   'Posted Successfully',
    //   ToastAndroid.SHORT,
    //   ToastAndroid.BOTTOM,
    //   25,
    //   50
    // );
    alert('Posted Succesfully')
    this.props.navigation.navigate('Home');
    this.setState({image: '#', about: ''})
  };
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'blue',
            flexDirection: 'row',
          }}>
          <View style={{ width: '85%', height: 45, justifyContent: 'center' }}>
            <Text
              style={{
                backgroundColor: 'blue',
                color: 'white',
                fontSize: 20,
                fontWeight: 'Bold',
                alignSelf: 'center',
              }}>
              Share An Image
            </Text>
          </View>
          <View style={{ width: '15%' }}>
            <TouchableOpacity style={styles.postButton} onPress={this.addPost}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      <KeyboardAvoidingView style= {styles.KeyboardAvoidingView}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              borderColor: 'black',
              borderWidth: 2,
              height: 250,
              width: 250,
            }}
            onPress={() => {
              this.selectPic();
            }}>
            {this.state.image === '#' ? (
              <Text style={{ alignSelf: 'center', marginTop: 125 }}>
                Click here to select a picture.
              </Text>
            ) : (
              <Image
                style={{ width: 245, height: 245 }}
                source={{ uri: this.state.image }}
              />
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.inputBox}
            placeholder={'About the Image'}
            multiline={true}
            onChangeText={(text) => {
              this.setState({ about: text });
            }}
          />
        </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dbdbdb',
  },
  inputBox: {
    fontSize: 18,
    paddingLeft: 15,
    borderWidth: 2,
    width: '75%',
    marginTop: 25,
    outline: 'none',
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
    KeyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 25,
  },
});
