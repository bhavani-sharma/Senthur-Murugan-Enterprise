import 'react-native-reanimated';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardScreen from "./Screens/DashboardScreen";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import UserScreen from './Screens/UserScreen';
import AddUser from './Screens/AddUser'; 
import AddItem from './Screens/AddItem';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} /> 
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="AddItem" component={AddItem} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
