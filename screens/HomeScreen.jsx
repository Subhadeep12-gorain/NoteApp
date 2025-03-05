import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import rafiki from "../assets/image/rafiki.png";

// Get screen width for responsiveness
const screenWidth = Dimensions.get("window").width;

// Generate random light colors
const getRandomColor = () => {
    const colors = ["#FFD700", "#FFB6C1", "#ADD8E6", "#98FB98", "#FFA07A"];
    return colors[Math.floor(Math.random() * colors.length)];
};

const HomeScreen = ({ navigation }) => {
    const [categories, setCategories] = useState([]);

    // Load categories from AsyncStorage
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const storedCategories = await AsyncStorage.getItem("categories");
                if (storedCategories) {
                    setCategories(JSON.parse(storedCategories));
                }
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };

        const unsubscribe = navigation.addListener("focus", fetchCategories);
        return unsubscribe;
    }, [navigation]);

    // Delete category when long pressed
    const handleDeleteCategory = async (category) => {
        Alert.alert(
            "Delete Category?",
            `Are you sure you want to delete "${category}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const updatedCategories = categories.filter((c) => c !== category);
                            setCategories(updatedCategories);
                            await AsyncStorage.setItem("categories", JSON.stringify(updatedCategories));
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete category.");
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Background Image (Opacity Adjusts Based on Categories) */}
            {categories.length === 0 && <Image source={rafiki} style={styles.backgroundImage} />}

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Notes</Text>
            </View>

            {/* Categories Grid */}
            {categories.length > 0 ? (
                <FlatList
                    data={categories}
                    key={categories.length}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2} // Display in 2 columns
                    columnWrapperStyle={styles.row} // Space between items
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("AddNotesScreen", { category: item })}
                            onLongPress={() => handleDeleteCategory(item)}
                        >
                            <View style={[styles.categoryItem, { backgroundColor: getRandomColor() }]}>
                                <Text style={styles.categoryText}>{item}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.text}>Create your first category!</Text>
                </View>
            )}

            {/* Floating Action Button - Opens Category Screen */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("CategoryScreen")}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        alignItems: "center",
    },
    backgroundImage: {
        width: 180,
        height: 180,
        position: "absolute",
        top: "25%",
        opacity: 0.5, // Adjusted opacity
    },
    header: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 50,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
        paddingBottom:20
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "#B0B0B0",
        fontSize: 16,
        marginTop: 10,
    },
    row: {
        justifyContent: "space-between", // Space items evenly in each row
        width: "90%",
        marginBottom: 10, // Add space between rows
    },
    categoryItem: {
        width: screenWidth * 0.42, // Adjust width for 2-column layout
        padding: 15,
        marginHorizontal: 5,
        borderRadius: 8,
        alignItems: "center",
    },
    categoryText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#121212",
        textAlign: "center",
    },
    fab: {
        position: "absolute",
        bottom: 20,
        right: 30,
        backgroundColor: "#2E2E2E",
        width: 65,
        height: 65,
        borderRadius: 32.5,
        justifyContent: "center",
        alignItems: "center",
    },
});
