import { Stack } from 'expo-router';
import { View } from 'react-native';
import 'react-native-reanimated';
import { colors } from '../src/theme/colors';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
