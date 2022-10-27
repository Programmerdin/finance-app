import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function MainPageComponent({ navigation, route }) {
  return (
    <View style={styles.the_View}>
      <StatusBar style="light" />

      {/* TouchableOpacity that navigates to DivisionQuizScreen */}
      <TouchableOpacity style={styles.navigation_button} onPress={() => navigation.navigate("DivisionQuiz")}>
        <Text style={styles.regular_text}>Division</Text>
      </TouchableOpacity>

      {/* TouchableOpacity that navigates to CompoundingQuizScreen */}
      {/* <TouchableOpacity style={styles.navigation_button} onPress={() => navigation.navigate("CompoundingQuiz")}>
        <Text style={styles.regular_text}>Compounding</Text>
      </TouchableOpacity> */}

      {/* TouchableOpacity that navigates to HistoryScreen */}
      <TouchableOpacity style={styles.navigation_button} onPress={() => navigation.navigate("History")}>
        <Text style={styles.regular_text}>History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  the_View: {
    justifyContent: "center", //Centered vertically
    alignItems: "center", // Centered horizontally
    flex: 1,
    backgroundColor: "#121212",
    color: "white",
  },
  navigation_button: {
    width: 190,
    height: 70,
    backgroundColor: "#BB86FC",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
  },
  regular_text: {
    color: "#121212",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 22,
  },
});
