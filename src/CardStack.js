import React, { Component } from 'react';
import { StyleSheet, View, Animated, PanResponder } from 'react-native';
import clamp from 'clamp';


const colors = ['red', 'blue', 'pink', 'green', 'purple', 'orange'];

const SWIPE_THRESHOLD = 120;

export default class CardStack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
      scale2: new Animated.Value(0.95),
      scale3: new Animated.Value(0.9),
      colorIndex: 0,
    };

    this.resetState = this.resetState.bind(this);
    this.moveNext = this.moveNext.bind(this);
    this.animateCardEntrance = this.animateCardEntrance.bind(this);
    this.renderBottomCard = this.renderBottomCard.bind(this);
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        // Center box
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});

        // Scale up
        this.state.scale.setValue(1.1);
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

  animateCardEntrance() {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(
          this.state.scale,
          { toValue: 1.1, duration: 100 }
        ),
        Animated.timing(
          this.state.scale,
          { toValue: 1, duration: 100 }
        ),
      ]),
      Animated.sequence([
        Animated.timing(
          this.state.scale2,
          { toValue: 1.05, duration: 100 }
        ),
        Animated.timing(
          this.state.scale2,
          { toValue: 0.95, duration: 100 }
        ),
      ]),
      Animated.sequence([
        Animated.timing(
          this.state.scale3,
          { toValue: 1, duration: 100 }
        ),
        Animated.timing(
          this.state.scale3,
          { toValue: 0.9, duration: 100 }
        ),
      ]),
    ])
    .start();
  }

  resetState() {
    this.state.pan.setValue({ x: 0, y: 0 });
    this.moveNext();
    this.animateCardEntrance();
  }
  
  moveNext() {
    const { colorIndex } = this.state;
    const newIndex = (colorIndex === colors.length - 1) ? 0 : colorIndex + 1;
    this.setState({ colorIndex: newIndex });
  }

  renderBottomCard(index, position, transform) {
    return <Animated.View
      style={transform}
    >
      <View style={[styles.card, { backgroundColor: colors[index + position] }]} />
    </Animated.View>;
  }

  render() {
    const { pan, scale, colorIndex, scale2, scale3 } = this.state;

    const [translateX, translateY] = [pan.x, pan.y];
    const rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
    const opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]})

    const topCard = {position: 'absolute', transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    const secondCard = {position: 'absolute', transform: [{translateX: 0}, {translateY: 10}, {rotate : '0deg'}, {scale: scale2}], opacity: 1};
    const bottomCard = {position: 'absolute', transform: [{translateX: 0}, {translateY: 20}, {rotate : '0deg'}, {scale: scale3}], opacity: 1};

    return (
      <View style={styles.container}>
        {this.renderBottomCard(colorIndex, 2, bottomCard)}
        {this.renderBottomCard(colorIndex, 1, secondCard)}
        <Animated.View
          {...this._panResponder.panHandlers}
          style={topCard}
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
    width: 150,
    height: 200,
  }
});