import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Handle Signup
    const handleSignup = async () => {
        try {
            const existingUser = await AsyncStorage.getItem("user");
            if (existingUser) {
                Alert.alert("Account Exists", "You already have an account. Please login.");
                return;
            }

            const user = { email, password };
            await AsyncStorage.setItem("user", JSON.stringify(user));
            await AsyncStorage.setItem("loggedIn", "true"); // Save login state
            Alert.alert("Success", "Account created successfully!");
            navigation.replace("Home");
        } catch (error) {
            Alert.alert("Error", "Something went wrong while signing up.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
        marginBottom: 20,
    },
    input: {
        width: "80%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#444",
        borderRadius: 8,
        backgroundColor: "#1E1E1E",
        color: "white",
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#2E2E2E",
        padding: 15,
        borderRadius: 8,
        width: "80%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    linkText: {
        color: "#aaa",
        marginTop: 15,
    },
});
