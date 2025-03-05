import React, { useState, useEffect, useCallback } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native"; // 🔥 Fix

const AddNotesScreen = ({ navigation, route }) => {
  const { category } = route.params || {};
  const [notes, setNotes] = useState([]);

  // 🔥 Use focus effect to refresh notes when navigating back
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  // Load notes from AsyncStorage
  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("notes");
      const parsedNotes = storedNotes ? JSON.parse(storedNotes) : {};
      setNotes(parsedNotes[category] || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load notes.");
    }
  };

  // 🔥 Function to handle updating notes after adding or editing
  const handleNoteSaved = async () => {
    await loadNotes(); // Reload updated notes
  };

  // Delete Note
  const deleteNote = async (title) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const storedNotes = await AsyncStorage.getItem("notes");
            let parsedNotes = storedNotes ? JSON.parse(storedNotes) : {};

            parsedNotes[category] = parsedNotes[category].filter(n => n.title !== title);

            await AsyncStorage.setItem("notes", JSON.stringify(parsedNotes));
            setNotes(parsedNotes[category]); // 🔥 Update state immediately

            Alert.alert("Deleted", "Note has been deleted.");
          } catch (error) {
            Alert.alert("Error", "Failed to delete the note.");
          }
        },
      },
    ]);
  };

  // Navigate to Edit Note Screen
  const editNote = (note) => {
    navigation.navigate("NoteScreen", { category, note, onNoteSaved: handleNoteSaved });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{category}</Text>
      </View>

      {/* Notes List */}
      {notes.length > 0 ? (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
              <TouchableOpacity onPress={() => editNote(item)} style={{ flex: 1 }}>
                <Text style={styles.noteTitle}>{item.title}</Text>
                <Text style={styles.noteContent} numberOfLines={2}>{item.content}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteNote(item.title)} style={styles.deleteButton}>
                <Ionicons name="trash" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No notes yet. Click + to add a note.</Text>
      )}

      {/* Add Note Button */}
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate("NoteScreen", { category, onNoteSaved: handleNoteSaved })}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default AddNotesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconButton: {
    padding: 8,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    marginTop:30
  },
  headerText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginLeft: 15,
    marginTop:30
  },
  noteItem: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  noteTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    
  },
  noteContent: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 5,
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
    backgroundColor: "red",
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#AAAAAA",
    textAlign: "center",
    marginTop: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#1E88E5",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
