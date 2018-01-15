import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';

export default class TestCard extends Component {
  render() {
    return (
      <View style={[styles.card, { backgroundColor: this.props.cardData || 'red' }]} />
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