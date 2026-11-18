import React from 'react';
import { Stack } from 'expo-router';

export default function SharedStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
