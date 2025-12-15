import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Switch, Text, TextInput, View } from 'react-native';
import { getTodo, updateTodo } from '../../src/services/todo-list-service';
import { colors } from '../../src/theme/colors';

export default function EditTodoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);
  const [includeLocation, setIncludeLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTodo = async () => {
      try {
        if (!id) return;

        const data = await getTodo(id);

        setTitle(data.title);
        setCompleted(data.completed);
        setIncludeLocation(!!data.location);
      } catch {
        Alert.alert('Error', 'No se pudo cargar el registro');
      }
    };

    loadTodo();
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;

    let locationData = undefined;

    if (includeLocation) {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        locationData = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        };
      }
    }

    try {
      setLoading(true);

      const res = await updateTodo(id, {
        title,
        completed,
        location: locationData
      });

      if (res.success) {
        router.back();
      } else {
        Alert.alert('Error', 'No se pudo actualizar');
      }
    } catch {
      Alert.alert('Error', 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Editar Todo
      </Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={{ backgroundColor: colors.surface, padding: 12, borderRadius: 12 }}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Título"
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
              backgroundColor: colors.surface
            }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ flex: 1 }}>Completado</Text>
            <Switch value={completed} onValueChange={setCompleted} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ flex: 1 }}>Incluir ubicación</Text>
            <Switch value={includeLocation} onValueChange={setIncludeLocation} />
          </View>

          <Pressable
            onPress={handleUpdate}
            style={{
              backgroundColor: colors.accent,
              padding: 12,
              borderRadius: 10,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Guardar cambios</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
