# react-native-actionsheet
pure JavaScript ActionSheet in React Native

if you need new features or find any bugs in using, contact me by issue plz.
## example
```javascript
state = {
  visible: false,
  chosen: 1,
}

// no z-index in react-native, so remember put this at the end of container because of modal
render() {
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text onPress={() => this.setState({visible: true})} style={{fontSize: 25}}>Open</Text>
    <ActionSheet
      options={['foo', 'bar', 'baz']}
      visible={this.state.visible}
      modalWillClose={chosen => this.setState({chosen, visible: false})}
      chosen={this.state.chosen}
      disable={[3]}
      bottom
    />
  </View>
} 
```
## props
|propName|type|desc|isRequired|
|:----:|:----:|:----:|:----:|
|options|array of strings|text of each option|√|
|visible|boolean|if true, activate this component|√|
|modalWillClose|Closure|in this callback, parent component should setState({visible: false}) and do other you want|√|
|chosen|number|the index of active option, begin with 1|optional|
|disable|array of numbers|the indexes of disable options|optional|
|bottom|boolean|if true, it will slide in from bottom. in default it's top|optional|
