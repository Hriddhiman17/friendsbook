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

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      allUsers: [],
      friendsList: [],
      allRequests: [],
      allFriends: [],
      image: '#',
      docId: '',
      userIdFriend: '',
      docIdFriend: '',
      searched: '',
      matches: [],
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
  addTheDocId() {
    db.collection('users').doc(this.state.docId).update({
      docId: this.state.docId,
    });
    db.collection('users').doc(this.state.docIdFriend).update({
      docId: this.state.docIdFriend,
    });
  }
  sendRequest = async (item) => {
    // this.addTheDocId();
    db.collection('users')
      .doc(this.state.docId)
      .update({ allRequests: { requestedTo: item.email_id } });
    db.collection('users')
      .doc(this.state.docIdFriend)
      .update({ allRequests: { requestedFrom: this.state.userId } });
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
        subtitle={
          ('Address :' + ' ' + item.address, 'Contact :' + ' ' + item.contact)
        }
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
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var allrequest = snapshot.docs.map(
          (doc) => doc.data().allRequests.requestedTo
        );

        this.setState({
          allRequests: allrequest,
        });
      });
  };
  deleteRequest = (item)=>{
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var allrequest = snapshot.docs.map(
          (doc) => doc.data().allRequests.requestedTo.delete()
        );})
  }
  componentDidMount() {
    this.getAllUsers();
    this.getUserProfilePic();
    this.getTheDocId();
    this.getAllRequests();
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
                  <Text>
                    You are not having any friends :( . Add your friends from
                    above.
                  </Text>
                ) : (
                  <FlatList
                    data={this.state.friendsList}
                    renderItem={this.renderItemForFriendLists}
                    keyExtractor={this.keyExtractorForFriendLists}
                  />
                )}
              </Card>

              {this.state.allFriends.length === 0 ? (
                <Card>
                  <Text>You are not having any friend requests :(</Text>
                </Card>
              ) : (
                <FlatList
                  data={this.state.allFriends}
                  renderItem={this.NaN}
                  keyExtractor={this.NaN}
                />
              )}
              {this.state.allRequests.length === 0 ? (
                <Card>
                  <Text>You have not sent any requests :(</Text>
                </Card>
              ) : (
                <FlatList
                  data={this.state.allRequests}
                  renderItem={({ item, i }) => (
                    <Card>
                    <ListItem
                      key={i}
                      subtitle={
                        'Email Id :' + ' ' + item
                      }
                      titleStyle={{ color: 'black', fontWeight: 'bold' }}
                      bottomDivider
                    />
                    </Card>
                  )}
                />
              )}
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
});
