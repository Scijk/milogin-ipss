import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { registerUser } from '../src/services/token.service';
import { colors } from '../src/theme/colors';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      Alert.alert('Validación', 'Completa todos los campos');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Validación', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirm) {
      Alert.alert('Validación', 'Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);

      const res = await registerUser({ email, password });

      if (res.success) {
        Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
        router.replace('/');
      } else {
        Alert.alert('Error', res.message || 'No se pudo registrar');
      }
    } catch (e: any) {
      Alert.alert(
        'Error',
        e?.response?.data?.message || 'Error al registrar usuario'
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
          elevation: 4
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
          Crear Cuenta
        </Text>

        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 12,
            marginBottom: 12
          }}
        />

        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 12,
            marginBottom: 12
          }}
        />

        <TextInput
          placeholder="Confirmar contraseña"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 12,
            marginBottom: 20
          }}
        />

        <Pressable
          onPress={handleRegister}
          style={{
            backgroundColor: colors.accent,
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: 'center'
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Registrarme
            </Text>
          )}
        </Pressable>
        <Pressable
          onPress={() => router.push('/')}
          style={{ marginTop: 16 }}>
          <Text style={{ textAlign: 'center', color: colors.accent }}>
            Volver al inicio de sesión
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
