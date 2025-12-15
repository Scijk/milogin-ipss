import { logout } from "@/src/services/token.service";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  createTodo,
  deleteTodo,
  listTodos,
} from "../../src/services/todo-list-service";
import { colors } from "../../src/theme/colors";
import { TodoListResponse, TodoRequest } from "../../src/types/TodoItem";

export default function TodosScreen() {
  const [todos, setTodos] = useState<TodoListResponse[]>();
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [includeLocation, setIncludeLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await listTodos();
      
      setTodos(data);
    } catch {
      Alert.alert("Error", "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Validación", "El título es obligatorio");
      return;
    }

    let locationData: TodoRequest["location"] = undefined;

    if (includeLocation) {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        locationData = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
      }
    }

    const payload: TodoRequest = {
      title,
      completed,
      location: locationData,
    };

    try {
      setLoading(true);
      const res = await createTodo(payload);

      if (res) {
        setTitle("");
        setCompleted(false);
        setIncludeLocation(false);
        loadTodos();
        Alert.alert("Éxito", "Registro creado correctamente");
      } else {
        Alert.alert("Error", "No se pudo crear el registro");
      }
    } catch (e) {
      Alert.alert("Error", "Error al crear el registro");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      loadTodos();
      Alert.alert("Éxito", "Eliminado correctamente");
    } catch {
      Alert.alert("Error", "No se pudo eliminar");
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <>
            {/* LOGOUT */}
            <Pressable
              onPress={async () => {
                await logout();
                router.replace('/');
              }}
              style={{ alignSelf: 'flex-end', marginBottom: 8 }}
            >
              <Text style={{ color: colors.error, fontWeight: 'bold' }}>
                Cerrar sesión
              </Text>
            </Pressable>

            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>
              Crear nuevo Todo
            </Text>

            {/* FORM */}
            <View
              style={{
                backgroundColor: colors.surface,
                padding: 12,
                borderRadius: 12,
                marginBottom: 16,
              }}
            >
              <TextInput
                placeholder="Título"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={colors.textSecondary}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 10,
                  backgroundColor: colors.surface,
                  color: colors.textPrimary
                }}
              />

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ flex: 1, color: colors.textPrimary }}>Completado</Text>
                <Switch value={completed} onValueChange={setCompleted} />
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ flex: 1, color: colors.textPrimary }}>
                  Incluir ubicación
                </Text>
                <Switch value={includeLocation} onValueChange={setIncludeLocation} />
              </View>

              <Pressable
                onPress={handleCreate}
                style={{
                  backgroundColor: colors.accent,
                  padding: 12,
                  borderRadius: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                  Crear Todo
                </Text>
              </Pressable>
            </View>

            {loading && <ActivityIndicator style={{ marginBottom: 16 }} />}
          </>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: colors.surface,
              padding: 12,
              borderRadius: 10,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontWeight: '600', color: colors.textPrimary }}>
              {item.title}
            </Text>

            <Text style={{ color: colors.textSecondary }}>
              Estado: {item.completed ? '✅ Completado' : '⏳ Pendiente'}
            </Text>

            {item.location && (
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                📍 {item.location.latitude}, {item.location.longitude}
              </Text>
            )}

            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/(protected)/detalle-todo',
                  params: { id: item.id },
                })
              }
            >
              <Text style={{ color: colors.accent, marginTop: 6 }}>
                Ver detalle
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/(protected)/edit-todo',
                  params: { id: item.id },
                })
              }
              style={{ marginTop: 6 }}
            >
              <Text style={{ color: colors.accent }}>Editar</Text>
            </Pressable>

            <Pressable
              onPress={() => handleDelete(item.id)}
              style={{ marginTop: 8 }}
            >
              <Text style={{ color: colors.error }}>Eliminar</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ textAlign: 'center', color: colors.textSecondary }}>
              No hay todos registrados
            </Text>
          ) : null
        }
      />
    </View>
  );
}
