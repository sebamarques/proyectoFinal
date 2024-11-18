import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding = ({ onComplete }) => {
    const navigation = useNavigation();

    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [isValidName, setIsValidName] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(false);

    const validateName = (name) => {
        const isValid = /^[A-Za-z]+$/.test(name);
        setIsValidName(isValid);
        setFirstName(name);
    };

    const validateEmail = (email) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setIsValidEmail(isValid);
        setEmail(email);
    };

    const isButtonDisabled = !(isValidName && isValidEmail);

    const handleNext = async () => {
        try {
            const userData = { firstName, email };
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            await AsyncStorage.setItem('isOnboardingCompleted', 'true');

            onComplete();
            navigation.replace('Home');
        } catch (error) {
            console.error('Failed to save user data:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Little Lemon</Text>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                />
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your first name"
                    value={firstName}
                    onChangeText={validateName}
                />
                {!isValidName && firstName.length > 0 && (
                    <Text style={styles.errorText}>First name must contain only letters.</Text>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={validateEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {!isValidEmail && email.length > 0 && (
                    <Text style={styles.errorText}>Enter a valid email address.</Text>
                )}

                <TouchableOpacity
                    style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                    disabled={isButtonDisabled}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F4CE14',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#495E57',
        marginBottom: 10,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    form: {
        width: '100%',
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#495E57',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#495E57',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#000000d',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Onboarding;
