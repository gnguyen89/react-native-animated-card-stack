import React, { PropTypes, Component } from 'react';
import { StyleSheet, View, Animated, PanResponder, Easing, Dimensions } from 'react-native';
import clamp from 'clamp';

const SWIPE_THRESHOLD = Dimensions.get('window').width / 2;

export default class AnimatedCardStack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
      bottomCardScale: new Animated.Value(0.5),
      dataIndex: 0,
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
        const swipeThreshold = this.props.swipeThreshold || SWIPE_THRESHOLD;
        if (Math.abs(this.state.pan.x._value) > swipeThreshold) {
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
          Animated.spring(
            this.state.pan,
            { toValue: { x:0, y:0 } }
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
          { toValue: 1.1, duration: 100, easing: Easing.bounce }
        ),
        Animated.timing(
          this.state.scale,
          { toValue: 1, duration: 100, easing: Easing.bounce }
        ),
      ]),
      Animated.sequence([
        Animated.timing(
          this.state.bottomCardScale,
          { toValue: 1, duration: 100 }
        ),
        Animated.timing(
          this.state.bottomCardScale,
          { toValue: 0.5, duration: 100 }
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
    const { dataIndex } = this.state;
    const { data } = this.props;
    const newIndex = (dataIndex === data.length - 1) ? 0 : dataIndex + 1;
    this.setState({ dataIndex: newIndex });
  }

  renderBottomCard(data, transform, element) {
    return data && <Animated.View
      style={transform}
    >
      {React.cloneElement(element, { cardData: data })}
    </Animated.View>;
  }

  render() {
    const { pan, scale, bottomCardScale, dataIndex } = this.state;
    const { children, data } = this.props;

    const [translateX, translateY] = [pan.x, pan.y];
    const rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
    const opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]})

    const topCard = {position: 'absolute', transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    const secondCardScale = bottomCardScale.interpolate({inputRange: [0.5, 1], outputRange: [0.95, 1.05]});
    const thirdCardScale = bottomCardScale.interpolate({inputRange: [0.5, 1], outputRange: [0.90, 1]});

    const secondCard = {position: 'absolute', transform: [{translateX: 0}, {translateY: 10}, {rotate : '0deg'}, {scale: secondCardScale}], opacity: 1};
    const bottomCard = {position: 'absolute', transform: [{translateX: 0}, {translateY: 20}, {rotate : '0deg'}, {scale: thirdCardScale}], opacity: 1};

    return (
      <View style={styles.container}>
        {this.renderBottomCard(data[dataIndex + 2], bottomCard, children)}
        {this.renderBottomCard(data[dataIndex + 1], secondCard, children)}
        <Animated.View
          {...this._panResponder.panHandlers}
          style={topCard}
        >
          {React.cloneElement(children, { cardData: data[dataIndex] })}
        </Animated.View>
      </View>
    );
  }
}

AnimatedCardStack.propTypes = {
  children: PropTypes.node,
  data: PropTypes.array,
  swipeThreshold: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});