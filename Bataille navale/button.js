import React from "react";
 import {Text,View ,TouchableOpacity } from "react-native";
 import global from "./style";


 export default function FlatButton({text , onpress}){
    return (
        <TouchableOpacity onPress={onpress}>
            <View style={global.vuebouton}>
                <Text style={global.buton}>{text }</Text>
            </View>
        </TouchableOpacity>
    )
 }