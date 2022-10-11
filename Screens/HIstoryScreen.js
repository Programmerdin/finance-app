import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import HistoryComponent from "../components/HistoryComponent";


export default function HistoryScreen({navigation}){
  
  return(
    <View style={styles.container}>
      <HistoryComponent navigation={navigation}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  HistoryComponent:{
    flex:1,
  },
})