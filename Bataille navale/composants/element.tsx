/* eslint-disable prettier/prettier */
import React, {EventHandler, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Alert, Animated, Button, Dimensions, PanResponder, StyleSheet, Text, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import { EventArgs } from 'react-native/Libraries/Performance/Systrace';
import { Float, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

const {width, height} = Dimensions.get("window")
const desiredHeight: Float = height * 0.9;
const desiredWidth: Float = width * 1;
const heightFootmenu: Float = height - desiredHeight
const WidthFootmenu: Float = width * 1
const TERRAIN_DE_JEUX1 = 1
const TERRAIN_DE_JEUX2 = 2
enum GameStates{
  PLACE_PIONS,
  POSITIONNE_CROIX,
  ATTEND_JOUEUR_ADVERSE,
  ANIMATION,
  JEU_TERMINE,
  DEBUT_DU_JEU
}
let state = GameStates.PLACE_PIONS

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
  const [croixPositions1, setCroixPositions1] = useState<PionPosition[]>([]);
  const [croixPositions2, setCroixPositions2] = useState<PionPosition[]>([]);
  
  const [terrainVisible, setTerrainVisible] = useState<Boolean>(true)
  const [currentGameState, setCurrentGameState] = useState(GameStates.PLACE_PIONS) 
  const nombreMaxPion = 5;
  


  // Utiliser pour positionner les pions
  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    // Ajoutez la position du pion à l'état

    if(state === GameStates.PLACE_PIONS)
    {
      
      if(pionPositions.length == nombreMaxPion)
      {
        return
      }
      else
      {
        setPionPositions([...pionPositions, 
          { x: restreindre(locationX, desiredWidth, 0), y: restreindre(locationY, desiredHeight, 0) }])
          ;
      }
      
        
    }
    
  }
  const handlePressPosCroix = (event: any) =>
  {
    // recuperation des coodonnees ecrans
    const { locationX, locationY } = event.nativeEvent;

    if(state == GameStates.POSITIONNE_CROIX)
    {
      
      if( croixPositions2.length >= 1)
      {
        return
      }
      setCroixPositions2 ([...croixPositions2, 
        { x: restreindre(locationX, desiredWidth, 0), y: restreindre(locationY, desiredHeight, 0) }]);
    }
    
    

  }


  // Utiliser pour gerer l'affichage des terrains
  const handleChangeTerrain = () =>
  {
    setTerrainVisible(!terrainVisible)
  }
  
  // Utiliser pour ajouter les pions de maniere aleatoire
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

  // Utiliser pour effacer les pions sur un terrain
  const handleresetTerrain = (terrainDejeux: number) => {
    
    if(terrainDejeux === TERRAIN_DE_JEUX1)
    {
      setPionPositions([])
    }
    else if(terrainDejeux === TERRAIN_DE_JEUX2)
    {
      setPionPositions2([])
    }
    
    
  }
  
  // Utiliser pour dire si 2 elements se touchent 
  function pionsSeTouchent(
    pion1: PionPosition, 
    pion2: PionPosition, 
    rayon1: number, rayon2: number): boolean {
      
      const distanceEntrePions = Math.sqrt((pion2.x - pion1.x) ** 2 + (pion2.y - pion1.y) ** 2);
      const sommeRayons = rayon1 + rayon2;
      
      return distanceEntrePions <= sommeRayons;
    }
    
  // utiliser pour savoir si un joueur a toucher des pions
  function hitPions()
  {
    for(let i = 0; i < pionPositions2.length; i++)
    {
      let touche = pionsSeTouchent(croixPositions2[0], pionPositions2[i], 25, 25) 
      if(touche)
      {
        ToastAndroid.show("Touche", ToastAndroid.SHORT);    
        return
      }
    }
  }

  // Utiliser pour simuler l'action du 2en joueur(CPU)
  function cpuPlay()
  {
    ToastAndroid.show("CPU", ToastAndroid.SHORT)
    if( croixPositions1.length >= 1)
      {
        // ici on change d'etat
        return
      }

      // generation d'une position aleatoire
      const pos = getPositionAleatoire(0, desiredWidth, 0, desiredHeight);
      // ajout de la position
      setCroixPositions1 ([...croixPositions1, 
        { x: restreindre(pos.x, desiredWidth, 0), y: restreindre(pos.y, desiredHeight, 0) }]);
  }
  

  function Dialog()
  {
    if(state == GameStates.DEBUT_DU_JEU)
    {
      Alert.alert("DEBUT DU JEU", "Positionne tes pions sur le terrain")
      state = GameStates.PLACE_PIONS
    }
    
  }
  

  function setState(etat:number)
  {
    state = etat
  }

  const MenuStatePositionneCroix = () =>
  {
    return (
      <View style={styles.container2FootMenu}>
        <TouchableOpacity style={styles.button} onPress={() => {handleresetTerrain(TERRAIN_DE_JEUX1)}}>
          <Text style={styles.buttonText}>Reset pion</Text>
        </TouchableOpacity>

        <View style={{width: 100}} />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    )
  }


  // Declaration des UseEffects
  useEffect( () => {
    hitPions()
  }
    , [croixPositions2])
  
  useEffect(() => {
    // Affiche la boîte de dialogue au démarrage du jeu
    Alert.alert("Bienvenue", "Prêt à jouer ? plaste tes pions sur le terrain");
  }, []);



  
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

        {croixPositions1.map((pion, index) => (    
          <View
          key={index}
          style={[styles.element3, { left: pion.x, top: pion.y }]}/>

        ))}
      
      </TouchableOpacity>}

      {/* terrain de jeu 2 */}
      {!terrainVisible && <TouchableOpacity
        style={{backgroundColor: "#01110", height: desiredHeight, width: desiredWidth}}
        onPress={handlePressPosCroix}>

        {pionPositions2.map((pion, index) => (
          
          <View
          key={index}
          style={[styles.element2, { left: pion.x, top: pion.y }]}/>

        ))}

        {croixPositions2.map((pion, index) => (
          
          <View
          key={index}
          style={[styles.element3, { left: pion.x, top: pion.y }]}/>

        ))}
        
        

      </TouchableOpacity>}

      <View style={{height: heightFootmenu, width: WidthFootmenu, backgroundColor: "white"}}>  
      {/* <Button
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
      /> */}
      <MenuStatePositionneCroix/>
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
  element3: {
    width: 25,
    height: 25,
    backgroundColor: 'orange',
    position: 'absolute',
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    width: 130,
    height: 50,
    justifyContent:"center",
    alignItems: "center",

  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  container2FootMenu: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

});

export default El;
