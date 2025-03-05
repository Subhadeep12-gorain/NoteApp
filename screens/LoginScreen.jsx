import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Check if user is already logged in
    useEffect(() => {
        const checkUserLogin = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
                navigation.replace("Home"); // Redirect if already logged in
            }
        };
        checkUserLogin();
        
    }, []);

    // Handle Login
    const handleLogin = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            if (!storedUser) {
                Alert.alert("No account found", "Please sign up first.");
                return;
            }

            const user = JSON.parse(storedUser);
            if (user.email === email && user.password === password) {
                await AsyncStorage.setItem("loggedIn", "true"); // Save login state
                navigation.replace("Home");
            } else {
                Alert.alert("Invalid Credentials", "Please check your email and password.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong while logging in.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

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

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
                <Text style={styles.linkText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

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
