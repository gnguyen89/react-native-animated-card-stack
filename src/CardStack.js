import React, { Component } from 'react';
import { StyleSheet, View, Animated, PanResponder } from 'react-native';
import clamp from 'clamp';


const colors = ['red', 'blue', 'yellow', 'green', 'purple', 'orange'];

const SWIPE_THRESHOLD = 120;

export default class CardStack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
      colorIndex: 0,
    };

    this.resetState = this.resetState.bind(this);
    this.moveNext = this.moveNext.bind(this);
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        // Center box
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});

        // Scale up
        this.state.scale.setValue(1.2);
      },
      onPanResponderMove: Animated.event([
        null, { dx: this.state.pan.x, dy: this.state.pan.y }
      ]),
      onPanResponderRelease: (e, { vx, vy }) => {
        // reset offset to help center box
        this.state.pan.flattenOffset();
        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
          if (vx >= 0) {
            velocity = clamp(vx, 3, 5);
          } else if (vx < 0) {
            velocity = clamp(vx * -1, 3, 5) * -1;
          }
          Animated.decay(this.state.pan, {
            velocity: {x: velocity, y: vy},
            deceleration: 0.98
          }).start(this.resetState)
        } else {
          Animated.spring(            //Step 1
            this.state.pan,         //Step 2
            { toValue: { x:0, y:0 } }     //Step 3
          ).start();
        }
        this.state.scale.setValue(1);
      },
    });
  }

  resetState() {
    this.state.pan.setValue({ x: 0, y: 0 });
    this.moveNext();
  }
  
  moveNext() {
    const { colorIndex } = this.state;
    const newIndex = (colorIndex === colors.length - 1) ? 0 : colorIndex + 1;
    this.setState({ colorIndex: newIndex });
  }

  render() {
    const { pan, scale, colorIndex } = this.state;

    const [translateX, translateY] = [pan.x, pan.y];
    const rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
    const opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]})

    const helloStyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    return (
      <View style={styles.container}>
        <Animated.View
          {...this._panResponder.panHandlers}
          style={helloStyles}
        >
          <View style={[styles.card, { backgroundColor: colors[colorIndex] }]} />
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
  card: {
    width: 100,
    height: 100,
  }
});