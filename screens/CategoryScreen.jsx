import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const CategoryScreen = ({ navigation }) => {
  const [categoryName, setCategoryName] = useState("");

  // Function to Save Category
  const saveCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Category name cannot be empty!");
      return;
    }

    try {
      // Retrieve existing categories from storage 
      const storedCategories = await AsyncStorage.getItem("categories");
      let categories = storedCategories ? JSON.parse(storedCategories) : [];

      // Check if category already exists
      if (categories.includes(categoryName.trim())) {
        Alert.alert("Error", "Category already exists!");
        return;
      }

      // Add new category
      categories.push(categoryName.trim());

      // Save updated categories to storage
      await AsyncStorage.setItem("categories", JSON.stringify(categories));

      Alert.alert("Success", "Category added successfully!");
      navigation.goBack(); // Navigate back to HomeScreen
    } catch (error) {
      Alert.alert("Error", "Failed to save category.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Category</Text>
      </View>

      {/* Category Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter category name"
        placeholderTextColor="#AAAAAA"
        value={categoryName}
        onChangeText={setCategoryName}
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveCategory}>
        <Text style={styles.saveText}>Save Category</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryScreen;

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
  backButton: {
    marginRight: 10,
    paddingTop:30
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    paddingTop:30
  },
  input: {
    fontSize: 18,
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingBottom: 5,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
