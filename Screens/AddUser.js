import { React, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native';
import { addParty } from '../supabaseClient';
import { sanitizeInput } from '../utils/inputSanitizer'; // Import sanitizeInput

export default function AddUser({ navigation }) {
  const [partyName, setPartyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddParty = async () => {
    // Validate
    if (!partyName.trim()) {
      Alert.alert('Error', 'Party name is required');
      return;
    }

    setLoading(true);

    try {
      const partyData = {
        party_name: sanitizeInput(partyName.trim()),
        contact_person: sanitizeInput(contactPerson.trim()) || null,
        phone_number: sanitizeInput(phoneNumber.trim()) || null,
        email: sanitizeInput(email.trim()) || null,
        address: sanitizeInput(address.trim()) || null,
        is_active: true,
      };

      const { data, error } = await addParty(partyData);

      if (error) {
        Alert.alert('Error', 'Failed to add party');
        console.error('Add party error:', error);
        setLoading(false);
        return;
      }

      Alert.alert('Success', 'Party added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>{`\n`}</Text>
        <Image source={require('../assets/logo.jpg')} style={styles.image} />
        <Text style={styles.logo}>Senthur Murugan Enterprises{`\n`}</Text>
        <Text style={styles.title}>Add Party</Text>

        <Text style={styles.label}>Party Name *</Text>
        <TextInput
          placeholder="Party Name"
          style={styles.input}
          value={partyName}
          onChangeText={setPartyName}
        />

        <Text style={styles.label}>Contact Person</Text>
        <TextInput
          placeholder="Contact Person Name"
          style={styles.input}
          value={contactPerson}
          onChangeText={setContactPerson}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          placeholder="Address"
          style={[styles.input, styles.textArea]}
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAddParty}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Party</Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:20,
    backgroundColor:'#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  logo: {
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
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 6,
    marginTop: 6,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button:{
    backgroundColor: '#5E5165',
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});