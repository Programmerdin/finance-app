import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text } from "react-native";
import MainPageComponent from "../components/MainPageComponent";


export default function MainPageScreen({navigation}){

  return(
    <View style={styles.the_View}>
      <MainPageComponent navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  the_View:{
    flex:1
  },
})