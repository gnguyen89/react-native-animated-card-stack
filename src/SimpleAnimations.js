import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';

export default class SimpleAnimations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fadeAnim: new Animated.Value(0),
      spin: new Animated.Value(0),
      pan: new Animated.ValueXY(),
    };
  }

  componentDidMount() {
    Animated.sequence([
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 1,
          duration: 4000,
        }
      ),
      Animated.timing(
        this.state.spin,
        {
          toValue: 1,
          duration: 3000,
        }
      ),
      Animated.spring(
        this.state.pan,
        {
          toValue: { x: 100, y: 100 },
          friction: 4
        }
      ),
      Animated.spring(
        this.state.pan,
        {
          toValue: { x: -200, y: -50 },
          friction: 4
        }
      ),
      Animated.decay(
        this.state.pan,
        {
          toValue: { x: 0, y: 0 },
          friction: 4
        }
      ),
    ]).start();
  }

  render() {
    const { fadeAnim, spin, pan } = this.state;
      const spinVal = spin.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{rotate: spinVal}], marginLeft: pan.x, marginTop: pan.y }}
        >
          <Text>Hello world!</Text>
        </Animated.View>
      </View>
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
});