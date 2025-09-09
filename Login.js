
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView,TextInput } from 'react-native';
export default function Login({navigation}) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeCon}>
        <Text style={styles.logo}>CMR Institute of Technology</Text>
        <View style={styles.formContainer}>
          <View style={styles.field}>
            <Text style={styles.label}>email</Text>
            <TextInput placeholder='abc@example.component' keyboardType='email-address' style={styles.input} />
            <Text style={styles.label}>Password</Text>
            <TextInput placeholder='Password' secureTextEntry style={styles.input} />
          </View>
          <TouchableOpacity>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.register}>
            <Text>Don't have an account yet?</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('Regitser')}>
              <Text style={styles.registerText}>Register here</Text>
            </TouchableOpacity>
          </View>
        </View> 
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    borderWidth: 10,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain'
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
});
