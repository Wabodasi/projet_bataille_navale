import { StyleSheet, View } from "react-native";

const  global = StyleSheet.create({
    view:{
        height: "45%"
        ,width:"99%",
        position: "absolute"
    },

    
    image:{
        width: "100%",
        height: "100%",
        shadowColor: "#646464",
        shadowOffset: {  width: 0,  height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 4,
        marginBottom:"12%"

    },


    

    buton:{
        color:"white",
        fontWeight:"bold",
        fontSize:20,
        textAlign:"center",
    },


    vuebouton:{
        width:"80%",
        height:"40%",
        justifyContent:"center",
        borderRadius:20,
        backgroundColor:"#1976D2",
        marginLeft:"10%"
        
    },



    login: {
        padding:"5%",
        width:"75%",
        height:"50%",
        marginTop: "30%",
        marginBottom: "30%",
        marginLeft: "12%",
        borderColor: "#1976D2",
        borderWidth: 20,
        borderRadius:20,
      },

    sublogin:{
        marginTop:"15%"
    },

    text:style={
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
      }
})
export default global;