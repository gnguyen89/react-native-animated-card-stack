import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';

export default class DragAndReset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        this.state.scale.setValue(1.2);
      },
      onPanResponderMove: Animated.event([
        null, { dx: this.state.pan.x, dy: this.state.pan.y }
      ]),
      onPanResponderRelease: (e, gesture) => {
        Animated.spring(            //Step 1
            this.state.pan,         //Step 2
            {toValue:{x:0,y:0}}     //Step 3
        ).start();
        this.state.scale.setValue(1);
      },
    });
  }

  render() {
    const { pan, scale } = this.state;

    const [translateX, translateY] = [pan.x, pan.y];
    const rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});

    const helloStyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}]};

    return (
      <View style={styles.container}>
        <Animated.View
          {...this._panResponder.panHandlers}
          style={helloStyles}
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