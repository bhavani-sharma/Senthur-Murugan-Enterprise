import React,{useState} from "react";
import { StyleSheet,Text,View,TouchableOpacity,SafeAreaView,   } from "react-native";
import { TextInput, Card} from "react-native-paper";


const Regitser=({navigation})=>{
  const [hidePass,setHidePass]=useState(true);
    return(
        <View style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
        <Text style={styles.logo}>Register</Text>
        <View style={styles.formContainer}>
            <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput placeholder='first-name last-name'style={styles.input}/>
            <Text style={styles.label}>Phone no.</Text>
            <TextInput placeholder='Phone no.' keyboardType="phone-pad" style={styles.input}/>
            <Text style={styles.label}>Email</Text>
            <TextInput placeholder='abc@example.com' keyboardType="email-address" style={styles.input}/>
            <Text style={styles.label}>Password</Text>
            <TextInput placeholder='Password' secureTextEntry={hidePass?true:false} right={
              <TextInput.Icon
                icon="eye"
                onPress={() => setHidePass(!hidePass)}
              />
            } style={styles.input}/>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput placeholder='Confirm Password' secureTextEntry={hidePass?true:false} right={
              <TextInput.Icon
                icon="eye"
                onPress={() => setHidePass(!hidePass)}
              />
            } style={styles.input}/>
          </View>
          <TouchableOpacity>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.register}>Already have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.registerText}>Login</Text>
          </TouchableOpacity>
        </View>
        </SafeAreaView>
        </View>
    )
}
export default Regitser;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 10,
    marginTop: 50,

  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain'
  },
  safeContainer: {
    flex: 1,
  },
  logo: {
    // backgroundColor: 'pink',
    // borderWidth:3,
    // borderColor: 'red',

    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',},
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
  
});
