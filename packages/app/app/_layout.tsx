import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

function HeaderTitle() {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="flame" size={22} color="#f97316" />
            <Text style={{ color: '#f97316', fontWeight: 'bold', fontSize: 18 }}>
                Javanizr
            </Text>
        </View>
    )
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        headerTitle: () => <HeaderTitle />,
                        headerStyle: { backgroundColor: '#1e1f22' },
                        headerTintColor: '#f97316',
                    }}
                />
            </Stack>
        </SafeAreaProvider>
    )
}
