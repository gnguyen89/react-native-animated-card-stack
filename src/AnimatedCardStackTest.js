import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';

import TestCard from './TestCard';
import AnimatedCardStack from './AnimatedCardStack';

const colors = ['red', 'blue', 'gray', 'green', 'purple', 'orange'];

export default class AnimatedCardStackTest extends Component {
  render() {
    return (
      <AnimatedCardStack data={colors}>
        <TestCard />
      </AnimatedCardStack>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  card: {
    width: 150,
    height: 200,
  }
});