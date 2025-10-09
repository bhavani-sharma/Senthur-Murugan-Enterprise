import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "./Screens/DashboardScreen";
import Login from "./Screens/Login";
import PartyScreen from "./Screens/PartyScreen";
import Register from "./Screens/Register";
import StockScreen from "./Screens/StockScreen";
import UserScreen from "./Screens/UserScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} /> 
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Stocks" component={StockScreen} />
        <Stack.Screen name="Party" component={PartyScreen} />
        <Stack.Screen name="User" component={UserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
