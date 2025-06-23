import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default function DialScreen() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [relation, setRelation] = useState('');
  const [location, setLocation] = useState<string>('Unknown');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to tag contacts.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync(loc.coords);

      if (address.length > 0) {
        const { city, region, country } = address[0];
        setLocation(`${city ?? ''}, ${region ?? ''}, ${country ?? ''}`);
      } else {
        setLocation('Unknown Location');
      }
    })();
  }, []);

  const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const saveContact = async () => {
    if (!name || !number) {
      Alert.alert('Missing Information', 'Please enter both name and number.');
      return;
    }

    const newContact = {
      name,
      number,
      time: getCurrentTime(),
      location,
      relation,
      contacted: false,
    };

    try {
      const existing = await SecureStore.getItemAsync('contacts');
      const contactList = existing ? JSON.parse(existing) : [];
      contactList.unshift(newContact);
      await SecureStore.setItemAsync('contacts', JSON.stringify(contactList));

      Alert.alert('Saved!', 'Contact saved successfully.');
      setName('');
      setNumber('');
      setRelation('');

      router.push('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to save contact.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Dial & Save</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Contact Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          value={number}
          onChangeText={setNumber}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Relation</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Friend, Parent, Co-worker"
          value={relation}
          onChangeText={setRelation}
        />
      </View>

      <Text style={styles.locationPreview}>📍 {location}</Text>

      <Button title="Save Contact" onPress={saveContact} color="#1e3a8a" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 24,
    textAlign: 'center',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#fff',
  },
  locationPreview: {
    marginBottom: 20,
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
