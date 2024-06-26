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
const TERRAIN_DE_JEUX1 = 0
const TERRAIN_DE_JEUX2 = 1
const PLAYER1 = 0
const PLAYER2 = 1

enum GameStates{
  PLACE_PIONS,
  POSITIONNE_CROIX,
  ATTEND_JOUEUR_ADVERSE,
  TOUR_JOUEUR2_TERMINE,
  TOUR_JOUEUR1_TERMINE,
  ANIMATION,
  JEU_TERMINE,
  DEBUT_DU_JEU
}
let state = GameStates.PLACE_PIONS

interface PionPosition {
  x: number;
  y: number;
}
interface Pion{
  position: PionPosition;
  estToucher: Boolean;
  estVisible: Boolean;
}

interface Croix{
  position: PionPosition;
  aToucher: Boolean;
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
  const [pions, setPions] = useState<Pion[]>([]);
  const [pions2, setPions2] = useState<Pion[]>([]);
  const [croixPositions1, setCroixPositions1] = useState<Croix[]>([]);
  const [croixPositions2, setCroixPositions2] = useState<Croix[]>([]);
  const [killPlayeur1, setKillPlayeur1] = useState(0);
  const [killPlayeur2, setKillPlayeur2] = useState(0);
  
  const [terrainVisible, setTerrainVisible] = useState<Boolean>(true)
  const [currentGameState, setCurrentGameState] = useState(GameStates.PLACE_PIONS) 
  const nombreMaxPion = 10;
  


  // Utiliser pour positionner les pions
  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    // Ajoutez la position du pion à l'état

    if(currentGameState === GameStates.PLACE_PIONS)
    {
      
      if(pions.length == nombreMaxPion)
      {
        return
      }
      else
      {
        let newPion: Pion = {
          position: { x: restreindre(locationX, desiredWidth, 0), y: restreindre(locationY, desiredHeight, 0) },

          estToucher: false,
          estVisible: true,

        }

        setPions([...pions, 
          newPion])
          ;
      }
      
        
    }
    
  }

  // Utiliser pour positionner les croix  
  const handlePressPosCroix = (event: any) =>
  {
    // recuperation des coodonnees ecrans
    const { locationX, locationY } = event.nativeEvent;

    if(currentGameState == GameStates.POSITIONNE_CROIX)
    {
      
      if( croixPositions2.length >= 1)
      {

      }

      let newCroix: Croix = {

        position: { x: restreindre(locationX, desiredWidth, 0), y: restreindre(locationY, desiredHeight, 0) },
        aToucher: false

      } 

      setCroixPositions2 ([...croixPositions2, 
        newCroix]);
      
        
      // changement de l'etat du jeu
      setCurrentGameState(GameStates.TOUR_JOUEUR1_TERMINE)
    }
    
    

  }


  // Utiliser pour gerer l'affichage des terrains
  const handleChangeTerrain = () =>
  {
    setTerrainVisible(!terrainVisible)
  }
  
  // Utiliser pour ajouter les pions de maniere aleatoire sur le terrain 2
  const handlerAutoAjoutPion = () => {
    if (pions2.length === nombreMaxPion) {
      return; // Si l'array est déjà plein, sortir de la fonction
    }
    
    const newPion = []; // Créer un nouvel array pour stocker les nouvelles positions
    
    for (let i = 0; i < nombreMaxPion; i++) {
      const pos = getPositionAleatoire(0, desiredWidth, 0, desiredHeight);
      newPion.push({

        position: { x: restreindre(pos.x, desiredWidth, 0), y: restreindre(pos.y, desiredHeight, 0) },
        estToucher: false,

        /////;;;;;;;;
        estVisible: false 

      }
        ); // Ajouter la nouvelle position à l'array temporaire
    }
  
    setPions2([...pions2, ...newPion]); // Ajouter toutes les new pions à l'array existant
  };

  // Utiliser pour effacer les pions sur un terrain
  const handleresetTerrain = (terrainDejeux: number) => {
    
    if(terrainDejeux === TERRAIN_DE_JEUX1)
    {
      setPions([])
    }
    else if(terrainDejeux === TERRAIN_DE_JEUX2)
    {
      setPions2([])
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
    
    
    if(currentGameState == GameStates.TOUR_JOUEUR1_TERMINE)
    {
      for(let i = 0; i < pions2.length; i++)
      {
        let touche = pionsSeTouchent(croixPositions2[croixPositions2.length-1].position, pions2[i].position, 12.5, 12.5) 
        if(touche)
        {
          

          if(pions2[i].estToucher == false)
          {
            pions2[i].estToucher = true

            ToastAndroid.show("J1 a Touche", ToastAndroid.SHORT);
            const tab = pions2.slice()
            tab[i].estVisible = true
            setPions2(tab)
          }
              
          return
        }
      }
    }
    else if(currentGameState == GameStates.TOUR_JOUEUR2_TERMINE)
    {
      
      for(let i = 0; i < pions.length; i++)
      {
        let touche = pionsSeTouchent(croixPositions1[croixPositions1.length-1].position, pions[i].position, 12.5, 12.5) 
        if(touche)
        {
          

          if(pions[i].estToucher == false)
          {
            pions[i].estToucher = true
            ToastAndroid.show("J2 a Touche", ToastAndroid.SHORT);
          } 

          return
        }
      }
    }

    
  }

  // Utiliser pour simuler l'action du 2en joueur(CPU)
  function cpuPlay()
  {
    //ToastAndroid.show("CPU", ToastAndroid.SHORT)

    if(true)
    {
      if( croixPositions1.length >= 1)
      {
        
      }

      // generation d'une position aleatoire
      const pos = getPositionAleatoire(0, desiredWidth, 0, desiredHeight);
      // ajout de la position
      let newcroix: Croix = {

        position: { x: restreindre(pos.x, desiredWidth, 0), y: restreindre(pos.y, desiredHeight, 0) },
        aToucher: false
      } 

      setCroixPositions1 ([...croixPositions1, 
      newcroix]);


      setCurrentGameState(GameStates.TOUR_JOUEUR2_TERMINE)
      
    }
    
      
  }

  function actionsCpu()
  {
    // le CPU poositionne sa croix
    cpuPlay()
    
  }

  
  // Utiliser pour l'ancer le jeu
  const handleStartGame = () =>
  {
    if(pions.length == nombreMaxPion)
    {
      // Ajout des pions automatiquement sur le terrain2 par cpu
      handlerAutoAjoutPion()
      // state = GameStates.POSITIONNE_CROIX
      setCurrentGameState(GameStates.POSITIONNE_CROIX)

      // changement du terrain de jeu
      handleChangeTerrain()

      Alert.alert('Partie commencée', 'La partie a commencé, positionnez votre croix où vous pensez que les pions adverses peuvent se trouver.', [{ text: 'OK' }]);

    }
  
  }

  const handleJouer = () =>
  {
    // Ajout des pions automatiquement sur le terrain2 par cpu
    //handlerAutoAjoutPion()
   // state = GameStates.POSITIONNE_CROIX

    setCurrentGameState(GameStates.POSITIONNE_CROIX)

    // changement du terrain de jeu
    handleChangeTerrain()
  }

  const handleCedeTour = () => {

    if(croixPositions2.length > 0)
    {
      // On change le terrain et l'etat du jeu
      setCurrentGameState (GameStates.ATTEND_JOUEUR_ADVERSE)
      handleChangeTerrain()

      // On planifie le temps que le CPU vas faire avant de jouer
      setTimeout(() => {

        actionsCpu()
        //ToastAndroid.show("apres 3 segonde", ToastAndroid.SHORT)
        //
        

      }, 1000)

    }
    else
    {
      ToastAndroid.show("Vous n'avez pas encore jouer!!!", ToastAndroid.SHORT)
    }
    
  }

  function getNonbrePionToucher(player: any)
  {
    let count = 0
    if(player === PLAYER1)
    { 
      
      for(let i = 0; i < pions.length; i++)
      {
        if(pions[i].estToucher == true)
        {
          count ++ 
        }
      }
      
    }
    else if((player === PLAYER2))
    {
      for(let i = 0; i < pions2.length; i++)
      {
        if(pions2[i].estToucher == true)
        {
          count ++ 
        }
      }
    }
    return count
  }


  function contorleGameFinish()
  {
    let nbPionPlayer1Toucher = getNonbrePionToucher(PLAYER1)
    let nbPionPlayer2Toucher = getNonbrePionToucher(PLAYER2)
        
    if(nbPionPlayer1Toucher >= nombreMaxPion)
    {
      setCurrentGameState(GameStates.JEU_TERMINE);
      Alert.alert("GAME TERMINER", "JOUEUR 2 A GAGNE!!")
      
      return
    }

    if(nbPionPlayer2Toucher >= nombreMaxPion)
    {
      setCurrentGameState(GameStates.JEU_TERMINE);
      Alert.alert("GAME TERMINER", "JOUEUR 1 A GAGNE!!")
      
      return
    }


  }

  function setState(etat:number)
  {
    state = etat
  }

  
  // Mes composants locaux
  const MenuStatePlacePions = () =>
  { 
    return (
      <View style={styles.container2FootMenu}>
        <TouchableOpacity style={styles.button} onPress={() => {handleresetTerrain(TERRAIN_DE_JEUX1)}}>
          <Text style={styles.buttonText}>Reset pion</Text>
        </TouchableOpacity>

        <View style={{width: 100}} />

        <TouchableOpacity style={styles.button} onPress={handleStartGame}>
          <Text style={styles.buttonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const MenuStateTourJoueur1termine = () =>
  {
    
    return (
      <View style={styles.container2FootMenu}>
        <TouchableOpacity style={styles.button} onPress={handleCedeTour}>
          <Text style={styles.buttonText}>Céder le tour</Text>
        </TouchableOpacity>
      </View>
    )
    
  }

  const MenuStateAttenteCpu = () =>
  {
    return(
      <View style={styles.container2FootMenu}>
        <TouchableOpacity style={styles.button} onPress={handleJouer}>
          <Text style={styles.buttonText}>Jouer</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const UIKillPlayers = () => 
  {
    const stylesUIKillPlayers =  StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center", 
        opacity: 1,
        position: "absolute",
        pointerEvents:"none",
        width: desiredWidth,
        height: 60
  
      },
      TextKill: {
        fontSize: 30,
        fontWeight: "700",
        margin: 10,

      }
  
    })
    return(
      <View style={stylesUIKillPlayers.container}>
        <Text style={stylesUIKillPlayers.TextKill}>{killPlayeur1}</Text>
        <Text style={stylesUIKillPlayers.TextKill}>{killPlayeur2}</Text>
      </View>
    )
  }



  
  

  // Declaration des UseEffects
  useEffect( () => {

    hitPions()
    contorleGameFinish()
  }
    , [croixPositions2])


  useEffect( () => {
    
    
    
    contorleGameFinish()
    //ToastAndroid.show(currentGameState+"rc", ToastAndroid.SHORT)
    
  }
    , [croixPositions1])

  useEffect(() => {

    hitPions()

  }, [currentGameState])
  
  useEffect(() => {
    
    // Affiche la boîte de dialogue au démarrage du jeu quand le jeu est lance
    Alert.alert("Bienvenue", "Prêt à jouer ? place tes pions sur le terrain");

  }, []);



  
  return (
    
  
    <View style={styles.container}>
      
      {/* terrain de jeu1  */}
      {terrainVisible && <View>
        <TouchableOpacity
        style={{backgroundColor: "#011111", height: desiredHeight, width: desiredWidth}}
        onPress={handlePress}>
        </TouchableOpacity>

        <View style={{height: desiredHeight, width: desiredWidth, position:"absolute", pointerEvents: "none"}}>
          
          {pions.map((pion, index) => (

            <View
            key={index}
            style={[styles.element, { left: pion.position.x, top: pion.position.y }]}>

              <View style={{position: "absolute", left: -12.5, top: -12.5, width: 25, height: 25, backgroundColor:"blue"}}/>

            </View>  

          ))}

          {croixPositions1.map((croix, index) => (    
            <View
            key={index}
            style={[styles.element3, { left: croix.position.x, top: croix.position.y }]}>
              <View style={{position: "absolute", left: -12.5, top: -12.5, width: 25, height: 25, backgroundColor:'orange'}}/>
            </View>

          ))}
          <UIKillPlayers/>    
        </View>

      </View>}

      {/* terrain de jeu 2 */}
      {!terrainVisible && <View>
        
        <TouchableOpacity
        style={{backgroundColor: "#01110", height: desiredHeight, width: desiredWidth}}
        onPress={handlePressPosCroix}>        
        </TouchableOpacity>

        <View style={{height: desiredHeight, width: desiredWidth, position:"absolute", pointerEvents: "none" }}>
          {pions2.map((pion, index) => (
          
            <View
            key={index}
            style={[styles.element2, { left: pion.position.x, top: pion.position.y }]}>

              {pion.estVisible && <View style={{position: "absolute", left: -12.5, top: -12.5, width: 25, height: 25, backgroundColor:"red"}}/>}

            </View>  

          ))}

          {croixPositions2.map((croix, index) => (
          
            <View
            key={index}
            style={[styles.element3, { left: croix.position.x, top: croix.position.y }]}>
              <View style={{position: "absolute", left: -12.5, top: -12.5, width: 25, height: 25, backgroundColor:'orange'}}/>        
            </View>

          ))}
          <UIKillPlayers/>
        </View>
        
      </View>}

      

      <View style={{height: heightFootmenu, width: WidthFootmenu, backgroundColor: "white"}}> 
        { currentGameState == GameStates.PLACE_PIONS && <MenuStatePlacePions/>}
        { currentGameState == GameStates.TOUR_JOUEUR1_TERMINE && <MenuStateTourJoueur1termine/>}
        { currentGameState == GameStates.TOUR_JOUEUR2_TERMINE  && <MenuStateAttenteCpu/>}
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
    //backgroundColor: 'white',
    position: 'absolute',
  },
  element2: {
    width: 25,
    height: 25,
    //backgroundColor: 'red',
    position: 'absolute',
  },
  element3: {
    width: 25,
    height: 25,
    //backgroundColor: 'white',
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
