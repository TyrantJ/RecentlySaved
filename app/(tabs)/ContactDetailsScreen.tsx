import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type ContactParams = {
  name?: string | string[];
  number?: string | string[];
  time?: string | string[];
  location?: string | string[];
  relation?: string | string[];
};

const normalize = (param: string | string[] | undefined): string =>
  Array.isArray(param) ? param[0] : param ?? '';

export default function ContactDetailsScreen() {
  const params = useLocalSearchParams<ContactParams>();
  const router = useRouter();

  const [name, setName] = useState(normalize(params.name));
  const [number, setNumber] = useState(normalize(params.number));
  const [time, setTime] = useState(normalize(params.time));
  const [location, setLocation] = useState(normalize(params.location));
  const [relation, setRelation] = useState(normalize(params.relation));
  const [isEditing, setIsEditing] = useState(false);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is needed.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const geo = await Location.reverseGeocodeAsync(loc.coords);
      if (geo.length > 0) {
        const place = geo[0];
        const locString = `${place.city || ''}, ${place.region || ''}`;
        setLocation(locString);
      }
    })();
  }, []);

  const openDial = () => Linking.openURL(`tel:${number}`);
  const sendSMS = () => Linking.openURL(`sms:${number}`);

  const saveChanges = async () => {
    try {
      const stored = await SecureStore.getItemAsync('contacts');
      let contactList = stored ? JSON.parse(stored) : [];

      const originalNumber = normalize(params.number);

      const updatedList = contactList.map((contact: any) => {
        if (contact.number === originalNumber) {
          return {
            ...contact,
            name,
            number,
            time,
            location,
            relation,
          };
        }
        return contact;
      });

      const found = contactList.some((c: any) => c.number === originalNumber);
      if (!found) {
        updatedList.push({ name, number, time, location, relation });
      }

      await SecureStore.setItemAsync('contacts', JSON.stringify(updatedList));
      Alert.alert('Success', 'Contact updated successfully.');
      setIsEditing(false);
      router.push('/');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save contact.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isEditing ? (
        <>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
          <TextInput style={styles.input} value={number} onChangeText={setNumber} placeholder="Number" />
          <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="Time Saved" />
          <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Location" />
          <TextInput style={styles.input} value={relation} onChangeText={setRelation} placeholder="Relation" />
        </>
      ) : (
        <>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.info}>Number: {number}</Text>
          <Text style={styles.info}>Time Saved: {time}</Text>
          <Text style={styles.info}>Location: {location}</Text>
          <Text style={styles.info}>Relation: {relation}</Text>
        </>
      )}

      {userLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker coordinate={userLocation} title="Current Location" />
        </MapView>
      )}

      <View style={styles.buttonRow}>
        <Button title="Call" onPress={openDial} />
        <Button title="Text" onPress={sendSMS} />
      </View>

      <View style={styles.buttonRow}>
        {isEditing ? (
          <Button title="Save Changes" onPress={saveChanges} />
        ) : (
          <Button title="Edit Contact" onPress={() => setIsEditing(true)} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e3a8a',
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  map: {
    width: '100%',
    height: 200,
    marginVertical: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});
