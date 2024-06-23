/* eslint-disable prettier/prettier */
import React, {EventHandler, useEffect, useLayoutEffect, useRef, useState} from 'react';
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

// Utiliser pour restreindre  la position d'un element 
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

function genererNombreEntier(min: number, max: number): number {
  const randomFloat = Math.random(); 
  const difference = max - min;
  const randomInteger = Math.floor(randomFloat * difference) + min; 

  return randomInteger;
}

function getPositionAleatoire(
  minPositionX: Float, 
  maxPositionX: Float, 
  maxPositionY: Float,
  minPositionY: Float): PionPosition
{
  let position: PionPosition = {
    x: genererNombreEntier(minPositionX, maxPositionX),
    y: genererNombreEntier(minPositionY, maxPositionY),
  }

  return position

}



function El(): React.JSX.Element {

  const [position, setPosition] = useState({x: 0,y: 0});
  const [pionPositions, setPionPositions] = useState<PionPosition[]>([]);
  const [pionPositions2, setPionPositions2] = useState<PionPosition[]>([]);
  const [terrainVisible, setTerrainVisible] = useState<Boolean>(true)
  const nombreMaxPion = 5;


  // Utiliser pour positionner les pions
  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    // Ajoutez la position du pion à l'état

    if(pionPositions.length == nombreMaxPion)
    {
      return
    }

    setPionPositions([...pionPositions, { x: restreindre(locationX, desiredWidth, 0), y: restreindre(locationY, desiredHeight, 0) }]);
  }

  // Utiliser pour gerer l'affichage des terrains
  const handleChangeTerrain = () =>
  {
    setTerrainVisible(!terrainVisible)
  }

  // Utiliser pour ajouter les pion de maniere aleatoire
  const handlerAutoAjoutPion = () => {
    if (pionPositions2.length === nombreMaxPion) {
      return; // Si l'array est déjà plein, sortir de la fonction
    }
  
    const newPionPositions = []; // Créer un nouvel array pour stocker les nouvelles positions
  
    for (let i = 0; i < nombreMaxPion; i++) {
      const pos = getPositionAleatoire(0, desiredWidth, 0, desiredHeight);
      newPionPositions.push({ x: restreindre(pos.x, desiredWidth, 0), y: restreindre(pos.y, desiredHeight, 0) }); // Ajouter la nouvelle position à l'array temporaire
    }
  
    setPionPositions2([...pionPositions2, ...newPionPositions]); // Ajouter toutes les nouvelles positions à l'array existant
  };

  
  return (
    
    
    <View style={styles.container}>
      
      {/* terrain de jeu1  */}
      {terrainVisible && <TouchableOpacity
        style={{backgroundColor: "#011111", height: desiredHeight, width: desiredWidth}}
        onPress={handlePress}>
          
        
          {pionPositions.map((pion, index) => (
            <View
            key={index}
            style={[styles.element, { left: pion.x, top: pion.y }]}/>
          ))}
      
      </TouchableOpacity>}

      {/* terrain de jeu 2 */}
      {!terrainVisible && <TouchableOpacity
        style={{backgroundColor: "#01110", height: desiredHeight, width: desiredWidth}}>

        {pionPositions2.map((pion, index) => (
          
          <View
          key={index}
          style={[styles.element2, { left: pion.x, top: pion.y }]}/>

        ))}
        

      </TouchableOpacity>}

      <View style={{height: heightFootmenu, width: WidthFootmenu, backgroundColor: "white"}}>
        
      <Button
        onPress={handleChangeTerrain}
        title="changer de terrain"
        color="#841584"
        accessibilityLabel="En savoir plus sur ce bouton violet"
      />
      <Button
        onPress={handlerAutoAjoutPion}
        title="auto"
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
  element2: {
    width: 25,
    height: 25,
    backgroundColor: 'red',
    position: 'absolute',
  },
});

export default El;
