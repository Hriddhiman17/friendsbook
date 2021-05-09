import React, { Component } from 'react';
import Login from './screens/LoginScreen';
import { TabNavigator } from './components/TabNavigator';
import Comment from './screens/CommentScreen';
import RestLogin from './screens/RestLogin';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}

const tabNavigator = createSwitchNavigator({
  Login: { screen: Login },
  TabNavigator: { screen: TabNavigator },
  Comment: {screen: Comment},
  RestLogin: {screen: RestLogin},
});

const AppContainer = createAppContainer(tabNavigator);
