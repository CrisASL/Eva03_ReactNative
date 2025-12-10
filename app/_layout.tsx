// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import 'react-native-reanimated';
import AuthProvider, { AuthContext } from '../components/context/auth-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InnerLayout />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

function InnerLayout() {
  const auth = useContext(AuthContext);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!auth?.email ? (
        <Stack.Screen name="LoginScreen" options={{ title: 'Login' }} />
      ) : (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </>
      )}
    </Stack>
  );
}

