
import { TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity,Image } from 'react-native';
import { SafeAreaView,TextInput } from 'react-native';
import React, {useState} from 'react';
import DashboardScreen from './DashboardScreen';
import { signIn } from '../supabaseClient';

export default function Login({navigation}) {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validate inputs
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        Alert.alert('Login Failed', error.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      if (data && data.user) {
        // Successfully logged in
        console.log('User logged in:', data.user.email);
        navigation.navigate('Dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeCon}>
        {/* <TouchableWithoutFeedback style={{flex:1}} onPress={()=>Keyboard.dismiss()}> */}
        <Image source={require('../assets/logo.jpg')} style={styles.image}/>
        <Text style={styles.logo}>Senthur Murugan Enterprises</Text>
        <View style={styles.formContainer}>
          <View style={styles.field}>
            <Text style={styles.label}>email</Text>
            <TextInput placeholder='abc@example.component' keyboardType='email-address' 
            onChangeText={val=>setEmail(val)} style={styles.input} />
            <Text style={styles.label}>Password</Text>
            <TextInput placeholder='Password' secureTextEntry onChangeText={val=>setPassword(val)} style={styles.input} />
          </View>
          <TouchableOpacity onPress={handleLogin} disabled={loading}>
            <View style={[styles.button, loading && styles.buttonDisabled]}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </View>
          </TouchableOpacity>
          <View style={styles.register}>
            <Text>Don't have an account yet?</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('Register')}>
              <Text style={styles.registerText}>Register here</Text>
            </TouchableOpacity>
          </View>
        </View> 
        {/* </TouchableWithoutFeedback> */}
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    // borderWidth: 10,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
  },
  safeCon: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    // backgroundColor: 'pink',
    // borderWidth:3,
    // borderColor: 'red',

    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  formContainer: {
    padding: 16,
  },
  image:{
    width:100,
    height:100,
    resizeMode:'contain',
    alignSelf:'center', 
    borderRadius:100,
  },
  field: {
    marginBottom: 16,
    JustifyContent: 'center',
  },
  input: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    marginTop: 6,
  },
  label: {
    textAlign:'center',
    alignContent:'center',
    fontSize: 18,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  button: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 6,
    borderRadius: 10,
    marginTop: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  register: {
    marginTop: 16,
    flexDirection: 'row',
    
  },
  registerText: {
    color: 'maroon',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
