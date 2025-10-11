import {React} from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native';
export default function AddItem({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{`\n`}</Text>
        <Text style={styles.title}>Add Item</Text>
        <Text style={{fontWeight:'600', fontSize:16}}>Date</Text>
        <TextInput placeholder="Date" style={styles.input} />
        <Text style={{fontWeight:'600', fontSize:16}}>Items:</Text>
        <TextInput placeholder="Item1" style={styles.input} />
        <TextInput placeholder="Quantity" style={styles.input} />
        <TextInput placeholder="Item2" style={styles.input} />
        <TextInput placeholder="Quantity" style={styles.input} />
        <TextInput placeholder="Item3" style={styles.input} />
        <TextInput placeholder="Quantity" style={styles.input} />
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Add Items</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        backgroundColor:'#fff',
        // alignItems:'center',
    },
    title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
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
  input: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    marginTop: 6,
    textAlign: 'center',
  },
  button:{
    backgroundColor: '#5E5165',
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
});