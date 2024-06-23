/* eslint-disable prettier/prettier */
import React, {EventHandler, useLayoutEffect, useRef, useState} from 'react';
import {Animated, Button, Dimensions, PanResponder, StyleSheet, Text, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import { EventArgs } from 'react-native/Libraries/Performance/Systrace';
import { Float, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

const {width, height} = Dimensions.get("window")
const desiredHeight: Float = height * 0.9;
const desiredWidth: Float = width * 1;
const heightFootmenu: Float = height - desiredHeight
const WidthFootmenu: Float = width * 1


interface PionPosition {
  x: number;
  y: number;
}


function El(): React.JSX.Element {

  const [position, setPosition] = useState({x: 0,y: 0});
  const [pionPositions, setPionPositions] = useState<PionPosition[]>([]);
  const [terrainVisible, setTerrainVisible] = useState<Boolean>(true)

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

  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    // Ajoutez la position du pion à l'état
    setPionPositions([...pionPositions, { x: restreindre(locationX, desiredWidth, 0), y: restreindre(locationY, desiredHeight, 0) }]);
  };

  const handleChangeTerrain = () =>
  {
    setTerrainVisible(!terrainVisible)
  }

  return (
    

    
    <View style={styles.container}>
      
      {terrainVisible && <TouchableOpacity
        style={{backgroundColor: "#011111", height: desiredHeight, width: desiredWidth}}
        onPress={handlePress}>

          {pionPositions.map((pion, index) => (
          <View
            key={index}
           style={[styles.element, { left: pion.x, top: pion.y }]}
          />

        ))}
      
      </TouchableOpacity>}
      
      {!terrainVisible && <TouchableOpacity
        style={{backgroundColor: "#01110", height: desiredHeight, width: desiredWidth}}>

      </TouchableOpacity>}

      <View style={{height: heightFootmenu, width: WidthFootmenu, backgroundColor: "white"}}>
        
      <Button
        onPress={handleChangeTerrain}
        title="changer de terrain"
        color="#841584"
        accessibilityLabel="En savoir plus sur ce bouton violet"
      />
        
      </View>

    </View>

    
  );
}




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
