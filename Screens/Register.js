import React,{useState} from "react";
import { StyleSheet,Text,View,TouchableOpacity,SafeAreaView, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Card} from "react-native-paper";
import { signUp } from '../supabaseClient';


const Regitser=({navigation})=>{
  const [hidePass,setHidePass]=useState(true);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validate inputs
    if (!fullName || !phoneNumber || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp(email, password, fullName, phoneNumber);

      if (error) {
        Alert.alert('Registration Failed', error.message || 'Unable to create account');
        setLoading(false);
        return;
      }

      if (data && data.user) {
        Alert.alert(
          'Success',
          'Account created successfully! Please check your email to verify your account.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      }
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
    return(
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.logo}>Register</Text>
            <View style={styles.formContainer}>
            <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder='first-name last-name'
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
            />
            <Text style={styles.label}>Phone no.</Text>
            <TextInput
              placeholder='Phone no.'
              keyboardType="phone-pad"
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder='abc@example.com'
              keyboardType="email-address"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder='Password'
              secureTextEntry={hidePass?true:false}
              right={
              <TextInput.Icon
                icon="eye"
                onPress={() => setHidePass(!hidePass)}
              />
            }
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              placeholder='Confirm Password'
              secureTextEntry={hidePass?true:false}
              right={
              <TextInput.Icon
                icon="eye"
                onPress={() => setHidePass(!hidePass)}
              />
            }
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <TouchableOpacity onPress={handleRegister} disabled={loading}>
            <View style={[styles.button, loading && styles.buttonDisabled]}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.register}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.registerText}>Login</Text>
          </TouchableOpacity>
        </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
}
export default Regitser;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 50,
    paddingBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain'
  },
  logo: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  formContainer: {
    padding:16,
  },
  field: {
    marginBottom: 16,
  },
  input: {
    backgroundColor:'#eee',
    padding:10,
    borderRadius:6,
  },
  button:{
    backgroundColor: 'blue',
    padding:16,
    borderRadius:6,
    borderRadius:10,
    marginTop:50,
  },
  buttonText:{
    color:'white',
    textAlign:'center',
  },
  register:{
    flexDirection:'row',
    marginTop:16,
  },
  registerText:{
    color:'maroon',
    fontWeight:'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
  },
});
