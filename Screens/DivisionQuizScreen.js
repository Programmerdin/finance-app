import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import DivisionQuizComponent from "../components/DivisionQuizComponent";

export default function DivisionQuizScreen({navigation}){
  
  return(
    <View style={styles.container}>
      <StatusBar style="auto" />
      <DivisionQuizComponent navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  DivisionQuizComponent:{
    flex:1,
  },
})