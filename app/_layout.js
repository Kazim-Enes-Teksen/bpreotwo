// app/_layout.js
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} /> {/* Login Screen */}
      <Stack.Screen name="menu" options={{ title: 'Menu' }} /> {/* Menu Screen */}
      <Stack.Screen name="scantest" options={{ title: 'Scan Test' }} /> {/* Scan Test Screen */}
      <Stack.Screen name="storedtests" options={{ title: 'Stored Test' }} /> {/* Stored Test Screen */}
      {/* Add more screens as needed */}
    </Stack>
  );
}