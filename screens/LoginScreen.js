import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  ToastAndroid,
} from 'react-native';
import { Card } from 'react-native-elements';
import Loader from '../components/Loader';
import firebase from 'firebase';
import db from '../config';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      address: '',
      contact: '',
      confirmPassword: '',
      shouldHideText: true,
      isModalVisible: false,
      isLoading: false,
    };
  }
  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}>
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: '100%' }}>
            <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
              <Text style={styles.modalTitle}>Registration</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={'First Name'}
                onChangeText={(text) => {
                  this.setState({
                    firstName: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Last Name'}
                onChangeText={(text) => {
                  this.setState({
                    lastName: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Contact'}
                maxLength={10}
                keyboardType={'numeric'}
                onChangeText={(text) => {
                  this.setState({
                    contact: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Address'}
                multiline={true}
                onChangeText={(text) => {
                  this.setState({
                    address: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Email'}
                keyboardType={'email-address'}
                onChangeText={(text) => {
                  this.setState({
                    email: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Password'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Confrim Password'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    confirmPassword: text,
                  });
                }}
              />
              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => {
                    this.userSignUp(
                      this.state.email,
                      this.state.password,
                      this.state.confirmPassword
                    ),
                      this.setState({ isLoading: true });
                  }}>
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => this.setState({ isModalVisible: false })}>
                  <Text style={{ color: 'red' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  userSignUp = (emailId, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return alert("Password doesn't match. Check your password.");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailId, password)
        .then(() => {
          db.collection('users').add({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            contact: this.state.contact,
            email_id: this.state.email,
            address: this.state.address,
          });
          return (
            // ToastAndroid.show(
            //   'User Added Successfully',
            //   ToastAndroid.SHORT,
            //   ToastAndroid.BOTTOM,
            //   25,
            //   50
            // ),
            alert('User Added Successfully'),
            this.setState({ isModalVisible: false, isLoading: false })
          );
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          this.setState({ isLoading: false });
          return alert(errorMessage);
        });
    }
  };
  login = (emailId, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then(() => {
        // ToastAndroid.show(
        //   'User  Logged In Successfully',
        //   ToastAndroid.SHORT,
        //   ToastAndroid.BOTTOM,
        //   25,
        //   50
        // );
        alert('User Logged In')
        this.setState({ isLoading: false });
        this.props.navigation.navigate('Home');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.setState({ isLoading: false });
        return alert(errorMessage);
      });
  };
  render() {
    const isTrue = this.state.isLoading;
    return isTrue ? (
      <Loader />
    ) : (
      <View style={styles.container}>
        <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
          <Text style={styles.text}>Friendsbook</Text>
          {this.showModal()}
          <Card>
            <TextInput
              style={[styles.inputBox, { marginTop: 50, width: '70%' }]}
              placeholder={'user@xyz.com'}
              placeholderTextColor={'grey'}
              keyboardType={'email-address'}
              onChangeText={(text) => {
                this.setState({ email: text });
              }}
            />
            <View style={styles.rowView}>
              <TextInput
                style={[styles.inputBox, { width: '90%' }]}
                placeholder={'Password'}
                placeholderTextColor={'grey'}
                secureTextEntry={this.state.shouldHideText}
                onChangeText={(text) => {
                  this.setState({ password: text });
                }}
              />
              {this.state.shouldHideText === true ? (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ shouldHideText: false });
                  }}>
                  <Image
                    style={{ width: 25, height: 15, marginTop: 5 }}
                    source={require('../assets/show.png')}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ shouldHideText: true });
                  }}>
                  <Image
                    style={{ width: 25, height: 15, marginTop: 5 }}
                    source={require('../assets/hide.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                this.setState({ isLoading: true });
                this.login(this.state.email, this.state.password);
              }}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </Card>
          <View style={[styles.rowView, { marginTop: 20 }]}>
            <Text>Do not have any account? </Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isModalVisible: true });
              }}>
              <Text style={styles.signUpButtonText}>SignUp</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#dbdbdb',
  },
  text: {
    color: 'blue',
    fontSize: 23,
    fontWeight: 'bold',
  },
  inputBox: {
    marginBottom: 25,
    fontSize: 18,
    paddingLeft: 15,
    borderColor: '#00c8ff',
    borderBottomWidth: 1.5,
    outline: 'none',
  },
  rowView: {
    flexDirection: 'row',
  },
  signUpButtonText: {
    color: 'blue',
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 10,
    width: '75%',
    borderRadius: 25,
    textAlign: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
    alignSelf: 'center',
  },
  KeyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 30,
    color: 'blue',
    margin: 50,
  },
  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
    marginRight: 30,
    marginLeft: 30,
    marginTop: 80,
    marginBottom: 80,
  },
  formTextInput: {
    width: '75%',
    height: 35,
    alignSelf: 'center',
    borderColor: 'blue',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  registerButton: {
    width: 200,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
  },
  registerButtonText: {
    color: 'blue',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelButton: {
    width: 200,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
