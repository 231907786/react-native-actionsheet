import React, {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native'

const {width, height} = Dimensions.get('window')
export default class ActionSheet extends React.Component{
  static propTypes = {
    options: React.PropTypes.array.isRequired,
    visible: React.PropTypes.bool.isRequired,
    modalWillClose: React.PropTypes.func.isRequired,
    chosen: React.PropTypes.number,
    disable: React.PropTypes.array,
    bottom: React.PropTypes.bool,
  }

  state = {
    visible: false,
    anim: [
      new Animated.Value(0),
      new Animated.Value(0),
    ],
    actionSheetContainerHeight: 0,
    fontAnimating: false,
    chosen: this.props.chosen,
    willSelfClosed: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({visible: true, fontAnimating: false})
      Animated.spring(
        this.state.anim[0],
        {
          toValue: 1,
          duration: 300,
        }
      ).start()
    }
    if (nextProps.visible === false && !this.state.willSelfClosed) {
      Animated.timing(
        this.state.anim[0],
        {
          toValue: 0,
          duration: 200,
        }
      ).start(() => this.setState({visible: false}))
    }
    if (this.props.chosen !== nextProps.chosen) {
      this.setState({chosen: nextProps.chosen})
    }
  }

  onPress = (index) => {
    if (index + 1 === this.state.chosen) {
      this.onCancel()
    }else {
      this.setState({fontAnimating: true, chosen: index + 1, willSelfClosed: true})
      Animated.sequence([
        Animated.timing(
          this.state.anim[1],
          {
            toValue: 1,
            duration: 200,
          }
        ),
        Animated.timing(
          this.state.anim[0],
          {
            toValue: 0,
            duration: 200,
          }
        ),
      ])
      .start(() => {
        const componentWillBeUnmounted = this.props.modalWillClose(index + 1)
        if (componentWillBeUnmounted) return
        this.setState({visible: false, fontAnimating: false, willSelfClosed: false})
        this.state.anim[1].setValue(0)
      })
    }
  }

  onCancel = () => {
    this.setState({willSelfClosed: true})
    Animated.timing(
      this.state.anim[0],
      {
        toValue: 0,
        duration: 200,
      }
    ).start(() => {
      this.props.modalWillClose()
      this.setState({visible: false, willSelfClosed: false})
    })
  }

  renderOption = (text, index) => {
    const active = this.state.chosen === index + 1
    let disable = false
    if (this.props.disable && this.props.disable.length) {
      disable = this.props.disable.indexOf(index + 1) !== -1
    }
    return (
      <TouchableOpacity
        activeOpacity={1}
        key={index}
        style={[styles.option, index > 0 && styles.topBorder]}
        onPress={() => !disable && this.onPress(index)}
      >
        <Animated.Text style={[styles.optionText,
          disable && {color: '#aaa'},
          this.state.fontAnimating && active && {
            fontSize: this.state.anim[1].interpolate({
              inputRange: [0, 1],
              outputRange: [16, 20],
            }),
            color: this.state.anim[1].interpolate({
              inputRange: [0, 1],
              outputRange: ['#000000', '#00a6e2'],
            }),
          }, !this.state.fontAnimating && active && styles.activeText]}>{text}</Animated.Text>
      </TouchableOpacity>
    )
  }

  render() {
    let outputRange = []
    if (this.props.bottom) {
      outputRange = [this.state.actionSheetContainerHeight, 0]
    }else {
      outputRange = [-this.state.actionSheetContainerHeight, 0]
    }
    return (
      <TouchableOpacity onPress={this.onCancel} style={[styles.modal, !this.state.visible && {height: 0},
        this.props.bottom && {justifyContent: 'flex-end'}
      ]} activeOpacity={1}>
        <Animated.View
          onLayout={e => {
            this.setState({actionSheetContainerHeight: e.nativeEvent.layout.height})
          }}
          style={[styles.actionSheetContainer, {
            transform: [{
              translateY: this.state.anim[0].interpolate({
                inputRange: [0, 1],
                outputRange,
              })
            }],
            opacity: this.state.anim[0],
          }]}
        >
          {this.props.options.map((option, i) => this.renderOption(option, i))}
        </Animated.View>
      </TouchableOpacity>
    )
  }

}

const styles = StyleSheet.create({
  modal: {
    width,
    height,
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    overflow: 'hidden',
  },
  actionSheetContainer: {
    paddingVertical: 25,
    backgroundColor: '#fff',
  },
  option: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  activeText: {
    fontSize: 20,
    color: '#00a6e2',
  },
  topBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
  }
})
