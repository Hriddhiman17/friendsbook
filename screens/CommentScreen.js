import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Header } from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allComments: [],
      postDocId: this.props.navigation.getParam('docId')['docId'],
      comment: '',
      userId: firebase.auth().currentUser.email,
    };
  }
  getAllComments = () => {
    db.collection('posts')
      .where('docId', '==', this.state.postDocId)
      .onSnapshot((snapshot) => {
        var post = snapshot.docs.map((document) => document.data());
        this.setState({
          allComments: post,
        });
      });
  };
  addTheComment = (comment) => {
    db.collection('posts').doc(this.state.postDocId).update({
      Comments: comment,
    });
  };
  componentDidMount() {
    this.getAllComments();
  }
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item, i }) => {
    return (
      <View>
        <Text>{item.Comments}</Text>
      </View>
    );
  };
  render() {
    // alert(this.state.allComments.length)
    return (
      <View style={styles.container}>
        <Header
          centerComponent={{
            text: 'friendsbook',
            style: { color: 'white', fontSize: 20, fontWeight: 'Bold' },
          }}
          leftComponent={
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Home');
              }}>
              <Text style={{ fontSize: 22, color: 'white' }}>{'<'}</Text>
            </TouchableOpacity>
          }
          backgroundColor="blue"
        />
        {this.state.allComments.length === 0 ? (
          <Text>Be The First To Comment</Text>
        ) : (
          <FlatList
            data={this.state.allComments}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />
        )}
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            style={{ width: '75%', height: 25 }}
            onChangeText={(text) => {
              this.setState({ comment: text });
            }}
          />
          <TouchableOpacity
            style={{ textAlign: 'center', backgroundColor: 'blue' }}
            onPress={() => this.addTheComment(this.state.comment)}>
            <Text style={{ color: 'white' }}>Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dbdbdb',
  },
});
