import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";



export default function MainPageComponent({navigation, route}){

  return(
    <View style={styles.the_View}>
      <StatusBar style="auto" />
      <Text>Main Page Component</Text>
      
      <Text>Divison Quiz</Text>
      {/* TouchableOpacity that navigates to DivisionQuizScreen */}
      <TouchableOpacity
        style={styles.navigation_button}
        onPress={() => navigation.navigate("DivisionQuiz")}
      >
        <Text>Division Quiz</Text>
      </TouchableOpacity>

      <Text>Compounding Quiz</Text>
      {/* TouchableOpacity that navigates to CompoundingQuizScreen */}
      <TouchableOpacity
        style={styles.navigation_button}
        onPress={() => navigation.navigate("CompoundingQuiz")}
      >
        <Text>Compounding Quiz</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  the_View:{
    justifyContent: 'center', //Centered vertically
    alignItems: 'center', // Centered horizontally
    flex:1
  },
  navigation_button:{
    width: 100,
    height: 50,
    backgroundColor: "#cc6627",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
})