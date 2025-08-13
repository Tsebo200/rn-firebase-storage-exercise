import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase'; // adjust path to your firebase config

const HomeScreen = () => {
  const navigation: any = useNavigation();
  const [memories, setMemories] = useState<any[]>([]);

  useEffect(() => {
    // Create a query to order by newest first
    const q = query(collection(db, "memories"), orderBy("createdAt", "desc"));

    // Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memoryList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMemories(memoryList);
    });

    // Cleanup listener when leaving screen
    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => navigation.navigate("Add")}>
        <MaterialIcons name="add-photo-alternate" size={24} color="green" />
      </Pressable>

      {memories.map((memory) => (
        <View style={styles.card} key={memory.id}>
          <Image
            style={styles.img}
            source={{ uri: memory.imageUrl }}
          />
          <Text>{memory.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20
  },
  img: {
    width: '100%',
    height: 200,
    objectFit: 'cover'
  }
});
