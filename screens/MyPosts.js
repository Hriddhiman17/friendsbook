import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import Header from '../components/AppHeader';
import db from '../config';
import firebase from 'firebase';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      userId: firebase.auth().currentUser.email,
      image: '#',
      name: '',
      uniqueId: '',
    };
  }
  getPosts = () => {
    db.collection('posts')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var post = snapshot.docs.map((document) => document.data());
        this.setState({
          posts: post,
        });
      });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <View style={{ marginTop: 50, marginBottom: 25, borderBottomWidth: 2.5 }}>
        <View style={{ flexDirection: 'row' }}>
          <Avatar
            rounded
            source={{
              uri: item.user_profile_pic,
            }}
            size={'small'}
          />
          <Text style={{ marginTop: 5 }}>{'  ' + item.name}</Text>
        </View>
        <Text style={{ marginLeft: 10 }}>{item.about}</Text>
        <Image
          style={{ width: '100%', height: 250 }}
          source={{ uri: item.image_link }}
        />
      </View>
    );
  };
  getUserProfile() {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + ' ' + doc.data().last_name,
            image: doc.data().profile_pic,
          });
        });
      });
  }
  componentDidMount() {
    this.getPosts();
    this.getUserProfile();
  }
  render() {
    console.log(this.state.uniqueId);
    return (
      <View style={styles.container}>
        <Header title={'Friendsbook'} />
        <ScrollView style={{ width: '100%' }}>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Profile');
              }}>
              <Avatar
                rounded
                source={{
                  uri: this.state.image,
                }}
                size="xlarge"
              />
              <Text style={{ fontSize: 22, alignSelf: 'center' }}>
                {this.state.name}
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.posts.length === 0 ? (
            <Text style={{ textAlign: 'center' }}>
              You are not having any posts. Share an image to see it here!!
            </Text>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.posts}
              renderItem={this.renderItem}
            />
          )}
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
});
