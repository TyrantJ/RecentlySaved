import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getContacts } from '../../contacts'; // Correct relative path

export default function StatsScreen() {
  const [contacted, setContacted] = useState(0);
  const [notContacted, setNotContacted] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const contacts = await getContacts();
        const contactedCount = contacts.filter(c => c.contacted).length;
        const notContactedCount = contacts.length - contactedCount;
        setContacted(contactedCount);
        setNotContacted(notContactedCount);
      };
      fetchData();
    }, [])
  );

  const maxValue = Math.max(contacted, notContacted, 1); // Prevent divide by 0
  const barData = [
    { label: 'Contacted', value: contacted },
    { label: 'Not Contacted', value: notContacted },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stats</Text>
      <Text style={styles.subtitle}>This Month</Text>

      <View style={styles.chart}>
        {barData.map((bar, index) => (
          <View key={index} style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  height: `${(bar.value / maxValue) * 100}%`,
                  backgroundColor: index === 0 ? '#1e3a8a' : '#94a3b8',
                },
              ]}
            />
            <Text style={styles.barLabel}>{bar.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.metrics}>
        <Text style={styles.metricText}>Contacts Made: {contacted}</Text>
        <Text style={styles.metricText}>Not Contacted: {notContacted}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    marginVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingBottom: 16,
  },
  barContainer: { alignItems: 'center', width: 80 },
  bar: { width: 40, borderRadius: 6 },
  barLabel: { marginTop: 8, fontSize: 14, color: '#374151' },
  metrics: { marginTop: 20 },
  metricText: { fontSize: 16, marginBottom: 5 },
});
