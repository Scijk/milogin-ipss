import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { login, saveToken } from '../services/token.service';
import { colors } from '../theme/colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('cgomez@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      //Alert.alert('Error', 'Debes ingresar email y contraseña');
      window.alert('Debes ingresar email y contraseña');
      return;
    }

    try {
      setLoading(true);
      const response = await login(email, password);

      if (response.success && response.data && response.data.token) {
        await saveToken(response.data.token);
        //Alert.alert('Éxito', 'Login correcto ✅');
        window.alert('Login correcto');
        router.replace('./(protected)/todos');
      } else {
        Alert.alert('Error', response.error || 'Credenciales inválidas');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'No se pudo conectar con el servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 24,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 4
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: 20,
            textAlign: 'center'
          }}
        >
          Iniciar Sesión
        </Text>

        <Text
          style={{
            color: colors.textSecondary,
            marginBottom: 6
          }}
        >
          Correo electrónico
        </Text>

        <TextInput
          placeholder="mail@empresa.com"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
            backgroundColor: colors.surface,
            color: colors.textPrimary
          }}
        />

        <Text
          style={{
            color: colors.textSecondary,
            marginBottom: 6
          }}
        >
          Contraseña
        </Text>

        <TextInput
          placeholder="••••••••"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 12,
            marginBottom: 24,
            backgroundColor: colors.surface,
            color: colors.textPrimary
          }}
        />

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => ({
            backgroundColor: colors.accent,
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: 'center',
            opacity: pressed ? 0.9 : 1
          })}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
              Ingresar
            </Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => router.push('/registro')}
          style={{ marginTop: 16 }}>
          <Text style={{ textAlign: 'center', color: colors.accent }}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
