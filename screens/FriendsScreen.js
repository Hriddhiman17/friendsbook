import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { ListItem, Card, Avatar } from 'react-native-elements';
import Header from '../components/AppHeader';
import db from '../config';
import firebase from 'firebase';

export default class Friends extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      allUsers: [],
      friendsList: [],
      allRequests: [],
      allFriends: [],
      allFriendRequests: [],
      image: '#',
      docId: '',
      userIdFriend: '',
      docIdFriend: '',
      searched: '',
      matches: [],
      docIdRequest: '',
      name: '',
    };
    this.matchesRef = null;
  }
  getUserProfilePic() {
    db.collection('users').onSnapshot((querySnapshot) => {
      var allImage = querySnapshot.docs.map((doc) => {
        this.setState({
          image: doc.data().profile_pic,
        });
        global.ppImg = doc.data().profile_pic;
      });
    });
  }

  getAllUsers = () => {
    db.collection('users')
      .where('email_id', '!=', this.state.userId)
      .onSnapshot((snapshot) => {
        var requestedallUsers = snapshot.docs.map((doc) => doc.data());
        this.setState({
          allUsers: requestedallUsers,
        });
      });
  };
  getTheDocId(item) {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            docId: doc.id,
            name: doc.data().first_name + ' ' + doc.data().last_name,
          });
        });
      });
    db.collection('users')
      .where('email_id', '==', this.state.userIdFriend)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            docIdFriend: doc.id,
          });
        });
      });
  }
  getSearchedUsers = (searched) => {
    this.matchesRef = db
      .collection('users')
      .where('email_id', '!=', this.state.userId)
      .where('first_name', '==', searched)
      .onSnapshot((snapshot) => {
        var requestedallUsers = snapshot.docs.map((doc) => doc.data());
        this.setState({
          matches: requestedallUsers,
        });
      });
  };
  getAllRequests = () => {
    db.collection('allRequests')
      // .orderBy('time', 'desc')
      .where('requestFrom', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var allrequest = snapshot.docs.map((doc) => doc.data());
        this.setState({
          allRequests: allrequest,
        });
      });
    db.collection('allRequests')
      .where('requestFrom', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var docId = snapshot.docs.map((doc) => doc.id);
        db.collection('allRequests').doc(docId).update({
          'docId': docId,
        });
      });
  };
  getAllFriendRequest = () => {
    db.collection('allRequests')
      .where('requestedTo', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var allreq = snapshot.docs.map((doc) => doc.data());
        this.setState({
          allFriendRequests: allreq,
        });
      });
  };
  addTheDocId() {
    db.collection('users').doc(this.state.docId).update({
      docId: this.state.docId,
    });
    db.collection('users').doc(this.state.docIdFriend).update({
      docId: this.state.docIdFriend,
    });
  }
  sendRequest = async (item) => {
    db.collection('allRequests').add({
      requestFrom: this.state.userId,
      friendProfilePic: item.profile_pic,
      friendName: item.first_name + ' ' + item.last_name,
      name: this.state.name,
      requestedTo: item.email_id,
      time: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  deleteR = (item) => {
    alert(item.docId);
    db.collection('allRequests').doc(item.docId).delete();
  };
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    this.setState({ userIdFriend: item.email_id, docIdFriend: item.docId });
    return (
      <ListItem
        key={i}
        leftElement={
          <Avatar
            rounded
            source={{
              uri: item.profile_pic,
            }}
            size={'large'}
          />
        }
        title={item.first_name + ' ' + item.last_name}
        subtitle={'Address :' + ' ' + item.address}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
          <TouchableOpacity
            onPress={() => {
              console.log(item.email_id);
              this.sendRequest(item), this.getTheDocId(item);
            }}>
            <Image
              style={{ width: 40, height: 40 }}
              source={require('../assets/addFriend.jpg')}
            />
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };
  keyExtractorForFriendLists = (item, index) => index.toString();

  renderItemForFriendLists = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        leftElement={
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size={'large'}
          />
        }
        title={item.first_name + ' ' + item.last_name}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
          <TouchableOpacity>
            <Image
              style={{ width: 40, height: 40 }}
              source={require('../assets/addFriend.jpg')}
            />
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };

  keyExtractorForUsersLists = (item, index) => index.toString();

  renderItemForUsersLists = ({ item, i }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View>
          <Avatar rounded source={{ uri: item.profile_pic }} size={'small'} />
          <Text>{item.first_name + ' ' + item.last_name}</Text>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              this.sendRequest(item);
            }}>
            <Image
              style={{ width: 40, height: 40 }}
              source={require('../assets/addFriend.jpg')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  keyExtractorForRequestLists = (item, index) => index.toString();

  renderItemForRequestLists = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        leftElement={
          <Avatar
            rounded
            source={{
              uri: item.friendProfilePic,
            }}
            size={'medium'}
          />
        }
        title={item.friendName}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
          <TouchableOpacity
            onPress={() => {
              this.deleteR(item);
            }}>
            <Image
              style={{ width: 20, height: 25 }}
              source={require('../assets/delete.png')}
            />
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };
  keyExtractorForFriendRequestLists = (item, index) => index.toString();

  renderItemForFriendRequestLists = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        leftElement={
          <Avatar
            rounded
            source={{
              uri: item.friendProfilePic,
            }}
            size={'medium'}
          />
        }
        title={item.name}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
          <View>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'green' }]}
              onPress={() => {
                // this.deleteR(item);
              }}>
              <Text>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'red' }]}
              onPress={() => {
                // this.deleteR(item);
              }}>
              <Text>Decline</Text>
            </TouchableOpacity>
          </View>
        }
        bottomDivider
      />
    );
  };
  componentDidMount() {
    this.getAllUsers();
    this.getTheDocId();
    this.getAllRequests();
    this.getUserProfilePic();
    this.getAllFriendRequest();
  }
  componentWillUnmount() {
    this.matchesRef;
  }
  render() {
    return (
      <View style={styles.container}>
        <Header title={'Add Friends +'} />
        <ScrollView>
          <View style={{ flexDirection: 'row', borderWidth: 2 }}>
            <TextInput
              style={styles.inputBox}
              placeholder={'Search Users'}
              onChangeText={(text) => {
                this.setState({ searched: text });
              }}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                this.getSearchedUsers(this.state.searched);
              }}>
              <Text>Search</Text>
            </TouchableOpacity>
          </View>
          {this.state.searched !== '' ? (
            <View>
              {this.state.matches.length === 0 ? (
                <Text>There are not any matches.</Text>
              ) : (
                <FlatList
                  renderItem={this.renderItemForUsersLists}
                  data={this.state.matches}
                  keyExtractor={this.keyExtractorForUsersLists}
                />
              )}
            </View>
          ) : (
            <View>
              <Card>
                <FlatList
                  horizontal
                  data={this.state.allUsers}
                  keyExtractor={this.keyExtractor}
                  renderItem={this.renderItem}
                />
              </Card>
              <Card>
                {this.state.friendsList.length === 0 ? (
                  <View style={{ textAlign: 'center' }}>
                    <Text>Friends</Text>
                    <Text>
                      You are not having any friends :( . Add your friends from
                      above.
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={this.state.friendsList}
                    renderItem={this.renderItemForFriendLists}
                    keyExtractor={this.keyExtractorForFriendLists}
                  />
                )}
              </Card>
              <Card>
                {this.state.allFriendRequests.length === 0 ? (
                  <View style={{ textAlign: 'center' }}>
                    <Text style={{ marginBottom: 20 }}>Friend Requests</Text>
                    <Text>You are not having any friend requests :(</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={{ marginBottom: 20 }}>Friend Requests</Text>
                    <FlatList
                      data={this.state.allFriendRequests}
                      renderItem={this.renderItemForFriendRequestLists}
                      keyExtractor={this.keyExtractorForFriendRequestLists}
                    />
                  </View>
                )}
              </Card>
              <Card>
                {this.state.allRequests.length === 0 ? (
                  <View style={{ textAlign: 'center' }}>
                    <Text style={{ marginBottom: 20 }}>My Requests</Text>
                    <Text>You have not sent any requests :(</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={{ alignSelf: 'center' }}>My Requests</Text>
                    <FlatList
                      data={this.state.allRequests}
                      renderItem={this.renderItemForRequestLists}
                      keyExtractor={this.keyExtractorForRequestLists}
                    />
                  </View>
                )}
              </Card>
            </View>
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
  inputBox: {
    borderRightWidth: 2,
    width: '80%',
    paddingLeft: 15,
    outline: 'none',
  },
  searchButton: {
    width: '20%',
    backgroundColor: 'rgb(0, 225, 0)',
    padding: 7,
    textAlign: 'center',
  },
  button: {
    padding: 5,
  },
});
