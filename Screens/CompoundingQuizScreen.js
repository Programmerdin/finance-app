import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import CompoundingQuizComponent from "../components/CompoundingQuizComponent";

export default function CompoundingQuizScreen({navigation}){
  
  return(
    <View style={styles.container}>
      <StatusBar style="auto" />
      <CompoundingQuizComponent navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  CompoundingQuizComponent:{
    flex:1,
  },
})