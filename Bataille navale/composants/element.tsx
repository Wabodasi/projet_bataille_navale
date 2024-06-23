/* eslint-disable prettier/prettier */
import React, {EventHandler, useLayoutEffect, useRef, useState} from 'react';
import {Animated, Dimensions, PanResponder, StyleSheet, Text, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import { EventArgs } from 'react-native/Libraries/Performance/Systrace';
import { Float, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

const {width, height} = Dimensions.get("window")
const desiredHeight: Float = height * 0.9;
const desiredWidth: Float = width * 1;


interface PionPosition {
  x: number;
  y: number;
}


function El(): React.JSX.Element {

  const [position, setPosition] = useState({x: 0,y: 0});
  const [pionPositions, setPionPositions] = useState<PionPosition[]>([]);


  const restreindre = (pos: Float, maxPos: Float, minPos: Float) => {
    
    if(pos > maxPos - 25)
    {
      return maxPos - 25;
    }
    if(pos < minPos )
    {
      return minPos 
    }

    return pos;
  }


  // const pan = useRef(new Animated.ValueXY()).current;

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}]),
  //     onPanResponderRelease: () => {
  //       pan.extractOffset();
  //     },
  //   }),
  // ).current;

  // const panResponder2 = useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder : () => true,
  //     onPanResponderMove: (event, gestureState) => 
  //     {
  //       setPosition({x: gestureState.moveX + position.x  , y: gestureState.moveY + position.y })
  //     },
  //     onPanResponderRelease: (event, gestureState) => {
        
  //     },
  //     onPanResponderGrant: (event, gestureState) => {
        
  //     }
  //   })
  // ).current

  // const handleTap = (event: any) => {
  //   const { locationX, locationY } = event.nativeEvent;
  //   setPosition({ x: restreindre(locationX, desiredWidth, 0), y: restreindre(locationY, desiredHeight, 0) });
  // };

  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    // Ajoutez la position du pion à l'état
    setPionPositions([...pionPositions, { x: restreindre(locationX, desiredWidth, 0), y: restreindre(locationY, desiredHeight, 0) }]);
  };


  return (
    // <View style={{backgroundColor:  "#011111" , height: 650, width: 500}}>
    //   <Animated.View style={[styles.element,{transform: [{translateX: pan.x}, {translateY: pan.y}]}]}
    //   {...panResponder.panHandlers}>
    //     <Text >hhhvv</Text>
    //   </Animated.View>
    // </View>

    // <View {...panResponder2.panHandlers} style={{backgroundColor: "#011111", height: 650, width: 500, position: "relative"}}>
    //   <Animated.View style={{left: position.x, top: position.y}}>
    //     <Text>
    //       waboasdasdas
    //     </Text>
    //   </Animated.View>
    // </View>
    //  <View style={styles.container}>
    //   <TouchableOpacity onPress={handleTap} style={{backgroundColor: "#011111", height: desiredHeight, width: desiredWidth}}>
    //     <View  style={[styles.element,{top: position.y, left: position.x}]}/>
    //   </TouchableOpacity>
    // </View>

    
    <View style={styles.container}>
      
      <TouchableOpacity
        style={{backgroundColor: "#011111", height: desiredHeight, width: desiredWidth}}
        onPress={handlePress}>

        {pionPositions.map((pion, index) => (
        <View
          key={index}
          style={[styles.element, { left: pion.x, top: pion.y }]}
        />
      ))}
      </TouchableOpacity>
    </View>

    
  );
}


// const styles = StyleSheet.create({
//   container:{
//     flex: 1,
//     position: "relative"

//   },
//   element:{
//     position: "absolute",
//     width: 100    
//   },
//   container2: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   touchableArea: {
//     backgroundColor: 'blue',
//     padding: 20,
//     borderRadius: 10,
//   },
//   fullScreen:
//   {
//     flex: 1
//   }
    
// })

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  element: {
    width: 25,
    height: 25,
    backgroundColor: 'blue',
    position: 'absolute',
  },
});

export default El;
