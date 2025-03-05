import React, { useState, useEffect } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const NoteScreen = ({ navigation, route }) => {
    const { category } = route.params || {}; // Get category from navigation
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // Load existing note if editing
    useEffect(() => {
        if (route.params?.note) {
            const { title, content } = route.params.note;
            setTitle(title);
            setContent(content);
        }
    }, [route.params?.note]);

    // Save Note to AsyncStorage
    const saveNote = async () => {
        if (!title.trim()) {
            Alert.alert("Error", "Title cannot be empty!");
            return;
        }

        try {
            const storedNotes = await AsyncStorage.getItem("notes");
            let notes = storedNotes ? JSON.parse(storedNotes) : {};

            if (!notes[category]) {
                notes[category] = [];
            }

            if (route.params?.note) {
                const noteIndex = notes[category].findIndex(n => n.title === route.params.note.title);
                if (noteIndex !== -1) {
                    notes[category][noteIndex] = { title, content, category };
                }
            } else {
                notes[category].push({ title, content, category });
            }

            await AsyncStorage.setItem("notes", JSON.stringify(notes));

            // 🔥 Call the callback to refresh the notes
            if (route.params?.onNoteSaved) {
                route.params.onNoteSaved();
            }

            Alert.alert("Success", "Note saved successfully!");
            Keyboard.dismiss();
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to save the note.");
        }
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={styles.iconGroup}>
                    <TouchableOpacity onPress={saveNote} style={styles.iconButton}>
                        <Ionicons name="save" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Title Input */}
            <TextInput
                style={styles.titleInput}
                placeholder="Title"
                placeholderTextColor="#AAAAAA"
                value={title}
                onChangeText={setTitle}
            />

            {/* Content Input */}
            <TextInput
                style={styles.contentInput}
                placeholder="Type something..."
                placeholderTextColor="#777777"
                value={content}
                onChangeText={setContent}
                multiline
            />


        </View>
    );
};

export default NoteScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    iconGroup: {
        flexDirection: "row",
    },
    iconButton: {
        padding: 10,
        marginLeft: 10,
        backgroundColor: "#1E1E1E",
        borderRadius: 8,
        marginTop: 30
    },
    titleInput: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#444",
        paddingBottom: 5,
    },
    contentInput: {
        flex: 1,
        fontSize: 18,
        color: "white",
        textAlignVertical: "top",
    },
    toolbar: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        backgroundColor: "#1E1E1E",
        borderRadius: 8,
        marginTop: 10,
    },
    toolbarIcon: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
