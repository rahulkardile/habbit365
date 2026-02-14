import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={style.container}
    >
      <Text style={style.text}>Habbit365</Text>
      <Text style={style.text}>Track your progress</Text>
    </View>                           
  );
}

const style = StyleSheet.create({
  text: {
    flex: 1,
    backgroundColor: '#yyy',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1, 
    backgroundColor: "",
    alignContent: "space-between",
  }
})
