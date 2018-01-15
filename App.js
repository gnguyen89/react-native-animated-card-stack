import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';
import Test from './src/AnimatedCardStackTest';

const SWIPE_THRESHOLD = 120;

export default class App extends Component {
  render() {
    return (
      <Test />
    );
  }
}