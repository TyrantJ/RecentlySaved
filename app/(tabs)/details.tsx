// app/(tabs)/recent/details.tsx
import { Stack } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function ContactDetailsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Contact Details', headerBackTitle: 'Back' }} />
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Amanda</Text>
        <Text style={{ fontSize: 18, marginTop: 8 }}>555-1234</Text>
        <Text style={{ marginTop: 16 }}>📍 Windhoek</Text>
        <Text>📅 Saved April 24 2024 at 10:30 AM</Text>
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <Button title="Call" onPress={() => {}} />
          <View style={{ width: 20 }} />
          <Button title="Message" onPress={() => {}} />
        </View>
      </View>
    </>
  );
}
