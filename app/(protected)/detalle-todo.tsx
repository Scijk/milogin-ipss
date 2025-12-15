import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getTodo } from '../../src/services/todo-list-service';
import { colors } from '../../src/theme/colors';
import { TodoListResponse } from '../../src/types/TodoItem';

export default function TodoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [todo, setTodo] = useState<TodoListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTodo = async () => {
      try {
        if (!id) return;
        const data = await getTodo(id);
        setTodo(data);
      } catch {
        Alert.alert('Error', 'No se pudo cargar el Todo');
      } finally {
        setLoading(false);
      }
    };

    loadTodo();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!todo) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No se encontró el Todo</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16 }}>
        {/* Información principal */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
            {todo.title}
          </Text>

          <Text style={{ marginBottom: 4 }}>
            Estado:{' '}
            <Text style={{ fontWeight: 'bold' }}>
              {todo.completed ? 'Completado' : 'Pendiente'}
            </Text>
          </Text>

          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
            Creado: {new Date(todo.createdAt).toLocaleString()}
          </Text>
        </View>

        {/* Mapa si existe ubicación */}
        {todo.location && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 12
            }}
          >
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
              Ubicación
            </Text>

            <MapView
              style={{ height: 250, borderRadius: 12 }}
              initialRegion={{
                latitude: todo.location.latitude,
                longitude: todo.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
            >
              <Marker
                coordinate={{
                  latitude: todo.location.latitude,
                  longitude: todo.location.longitude
                }}
                title={todo.title}
              />
            </MapView>

            <Text
              style={{
                marginTop: 8,
                fontSize: 12,
                color: colors.textSecondary
              }}
            >
              Lat: {todo.location.latitude} | Lng:{' '}
              {todo.location.longitude}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
