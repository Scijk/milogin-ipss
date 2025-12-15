import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../src/screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
