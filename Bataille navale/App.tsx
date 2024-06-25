/*cle API : AIzaSyA7FooSqjKxemabtIefdmV_BmVQz5rgInY */
/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Image, Text, View,Button, TextInput,KeyboardAvoidingView, Platform} from 'react-native';
import El from './composants/element';
import global from "./style.js";
import FlatButton from './button.js';

function App(): React.JSX.Element {
  return (
    <View style={global.view}>
      <Image source={require("./assets/images/acceuil.jpg")}  style={global.image}/>
      
      <FlatButton  text={"Login "} onpress={login()}/>
      <FlatButton  text={"Jouer En LoCal"}  onpress={login()}/>
      <FlatButton  text={"Jouer En Ligne"}  onpress={login()}/>
    </View>
  );
}




function login(){

  const [Username , setName] = useState("")
  const [password , setPassword] = useState("")

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={global.login}>
          <View style={global.sublogin}>
            <Text style={{ fontSize: 30, textAlign: "center" }}>Username</Text>
            <TextInput style={global.text} onChangeText={(val)=>setName(val)}/>
          </View>
  
          <View style={global.sublogin}>
            <Text style={{ fontSize: 30, textAlign: "center" }}>Password</Text>
            <TextInput style={global.text} secureTextEntry={true}  onChangeText={(val)=>setPassword(val)}/>
          </View>
        </View>
        <FlatButton text={"Login"} onpress={() => {console.log(password)}} />
      </KeyboardAvoidingView>
    </View>
  );
}




function createaccount(){
  const [Username , setName] = useState("Username")
  const [password , setPassword] = useState("Password")

  
  return (
    <El></El>
  );

}




export default createaccount;
