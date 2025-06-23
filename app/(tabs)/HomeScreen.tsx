import { useFocusEffect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type ContactItem = {
  name: string;
  number: string;
  time: string;
  location: string;
  relation?: string;
  contacted?: boolean;
};

export default function HomeScreen() {
  const [data, setData] = useState<ContactItem[]>([]);
  const router = useRouter();

  const loadContacts = useCallback(async () => {
    const stored = await SecureStore.getItemAsync('contacts');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setData(parsed);
        }
      } catch (err) {
        console.error('Error parsing contacts:', err);
        setData([]);
      }
    } else {
      setData([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [loadContacts])
  );

  const sortByName = () => {
    const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
    setData(sorted);
  };

  const renderItem: ListRenderItem<ContactItem> = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/ContactDetailsScreen',
          params: {
            name: item.name,
            number: item.number,
            time: item.time,
            location: item.location,
            relation: item.relation ?? '',
            contacted: item.contacted?.toString() ?? 'false',
          },
        })
      }
      style={styles.itemContainer}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.number}>📞 {item.number}</Text>
      {item.relation ? <Text style={styles.meta}>Relation: {item.relation}</Text> : null}
      <Text style={styles.meta}>🕒 {item.time}</Text>
      <Text style={styles.meta}>📍 {item.location}</Text>
      <Text style={styles.status}>
        
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f4f7" />
      <View style={styles.headerRow}>
        <Text style={styles.header}>Recent Numbers</Text>
        <TouchableOpacity onPress={sortByName} style={styles.sortButton}>
          <Text style={styles.sortText}>Sort A–Z</Text>
        </TouchableOpacity>
      </View>
      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No contacts saved yet.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f7', paddingTop: 10 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a' },
  sortButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sortText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  number: { fontSize: 15, fontWeight: '600', color: '#2563eb' },
  meta: { fontSize: 13, color: '#64748b' },
  status: { marginTop: 6, fontSize: 13, fontWeight: '500', color: '#059669' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: { fontSize: 16, color: '#94a3b8', textAlign: 'center' },
});
