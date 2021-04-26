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
import { ListItem, Avatar, Icon } from 'react-native-elements';
import Header from '../components/AppHeader';
import db from '../config';
import firebase from 'firebase';
import PopUpMenu from '../components/Pop-Up-Menu';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      userId: firebase.auth().currentUser.email,
      image: '#',
      name: '',
      uniqueId: '',
      docId: '',
      postDocId: '',
      visible: false,
      hasLiked: false,
    };
  }
  getPosts = () => {
    db.collection('posts').onSnapshot((snapshot) => {
      var post = snapshot.docs.map((document) => document.data());
      this.setState({
        posts: post,
      });
    });
  };

  addLike = (like, docId) => {
    if (this.state.hasLiked === false) {
      db.collection('posts')
        .doc(docId)
        .update({
          likes: like + 1,
        });
    }
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
          style={{ width: '100%', height: 250, borderBottomWidth: 2 }}
          source={{ uri: item.image_link }}
        />
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              width: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRightWidth: 1,
            }}
            onPress={() => {
              this.getTheDocId(item.uniqueId),
                this.addLike(item.likes, item.docId),
                this.addTheLikesFrom(item);
            }}>
            <Image
              style={{ alignSelf: 'center', width: 25, height: 25 }}
              source={require('../assets/like.png')}
            />
            <Text>Like</Text>
            <Text> - {item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              width: '50%',
              alignItems: 'center',
              borderLeftWidth: 1,
              justifyContent: 'center',
            }} onPress= {()=>{this.props.navigation.navigate('Comment', {docId: item})}}>
            <Image
              style={{ width: 25, height: 25 }}
              source={require('../assets/comment.png')}
            />
            <Text>Comment</Text>
          </TouchableOpacity>
        </View>
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
  getTheDocId(uniqueId) {
    db.collection('posts')
      .where('uniqueId', '==', uniqueId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            postDocId: doc.id,
          });
          this.addTheDocId(doc.id);
        });
      });
  }
  addTheDocId = (uniqueId) => {
    db.collection('posts').doc(this.state.postDocId).update({
      docId: this.state.postDocId,
    });
  };
  addTheLikesFrom = (item) => {
    this.setState({ hasLiked: true });
    db.collection('posts').doc(item.docId).update({
      likeFrom: this.state.userId,
    });
  };
  getTheLikesFrom = () => {
    db.collection('posts')
      .where('docId', '==', this.state.postDocId)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().likeFrom == this.state.userId) {
            this.setState({ hasLiked: true });
          }
          this.setState({})
        });
      });
  };
  componentDidMount() {
    this.getPosts();
    this.getUserProfile();
    this.getTheLikesFrom();
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
                  this.props.navigation.navigate('Login'),
                  firebase.auth().signOut();
              }}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => {
                this.setState({ visible: false });
              }}>
              <Text style={styles.buttonText}>Close</Text>
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
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'blue',
            alignItems: 'center',
            height: 100,
          }}>
          <View>
            <Text
              style={{
                alignSelf: 'center',
                color: 'white',
                fontSize: 25,
                marginLeft: 5,
                fontWeight: 'bold',
              }}>
              friendsbook
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPressOut={() => {
                this.setState({ visible: true, height: 100 });
              }}>
              <Image
                style={{ height: 25, width: 5, marginRight: 25 }}
                source={require('../assets/More.png')}
              />
            </TouchableOpacity>
            {this.openMore()}
          </View>
        </View>
        <ScrollView style={{ width: '100%' }}>
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 3,
              padding: 10,
              width: '100%',
            }}>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => {
                this.props.navigation.navigate('Profile');
              }}>
              <Avatar
                rounded
                source={{
                  uri: this.state.image,
                }}
                size={'large'}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 22 }}>{' ' + this.state.name}</Text>
          </View>
          {this.state.posts.length === 0 ? (
            <Text></Text>
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
  moreContainer: {
    borderRadius: 5,
    marginRight: 20,
    padding: 5,
    height: 65,
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
  },
  moreButton: {
    padding: 3,
  },
  buttonText: {
    fontSize: 18,
  },
});
