import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, TextInput } from 'react-native';

export default function SignUpScreen() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        console.log('Signing up with:', { firstName, lastName, email, password });
        router.push('/login');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <VStack space="md">
                    <Text className="text-2xl font-bold text-center mb-6">Create An Account</Text>
                    
                    <TextInput
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                    />
                    
                    <TextInput
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                    />
                    
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                    />
                    
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                    />
                    
                    <Button onPress={handleSignUp}>
                        <ButtonText>Sign Up</ButtonText>
                    </Button>
                    
                    <Button
                        variant="link"
                        onPress={() => {
                            router.push("/login");
                        }}
                    >
                        <ButtonText>Already have an account?</ButtonText>
                    </Button>
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}