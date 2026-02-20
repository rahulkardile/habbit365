import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={style.container}
    >
      <Link href="/createhabitPage">
        <Text style={style.text}>Go to Dashboard</Text>
      </Link>
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
