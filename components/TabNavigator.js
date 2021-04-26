import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import Profile from '../screens/ProfileScreen';
import Share from '../screens/SharingImageScreen';
import Home from '../screens/HomeScreen';
import Friends from '../screens/FriendsScreen';
import MyPosts from '../screens/MyPosts';
import { createBottomTabNavigator } from 'react-navigation-tabs';

export const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require('../assets/home.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
      tabBarLabel: 'Home',
    },
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require('../assets/profile.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
      tabBarLabel: 'Profile',
    },
  },
  Share: {
    screen: Share,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require('../assets/share.png')}
          style={{ width: 20, height: 24 }}
        />
      ),
      tabBarLabel: 'Share',
    },
  },
  Friends: {
    screen: Friends,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require('../assets/addFriendIcon.png')}
          style={{ width: 25, height: 25 }}
        />
      ),
      tabBarLabel: 'Friends',
    },
  },
  MyPosts: {
    screen: MyPosts,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require('../assets/myPosts.png')}
          style={{ width: 20, height: 25 }}
        />
      ),
      tabBarLabel: 'My Posts',
    },
  },
});
