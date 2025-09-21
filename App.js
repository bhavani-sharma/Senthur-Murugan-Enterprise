import HomeScreen from './Screens/HomeSceen';
import Login from './Screens/Login';
import Register from './Screens/Register';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName='Login'>
         <Stack.Screen name="Login" component={Login} />
         <Stack.Screen name="Register" component={Register} />
         <Stack.Screen name="Home Screen" component={HomeScreen}/>
       </Stack.Navigator>
     </NavigationContainer>
  );
}