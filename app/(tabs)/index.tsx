import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../../components/context/auth-context";
import NewTask from "../../components/new-task";
import TaskItem from "../../components/task-item";
import { api } from "../../services/api";
import { Task } from "../../utils/types";

export default function TabsScreen() {
  const auth = useContext(AuthContext);
  const userEmail = auth?.email ?? "";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await api.getTasks();
      setTasks(fetchedTasks);
    } catch (error: any) {
      Alert.alert("Error", "No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  // Cargar tareas del usuario al iniciar sesión
  useEffect(() => {
    if (userEmail) loadTasks();
  }, [userEmail]);

  const handleCreateTask = async (taskData: {
    title: string;
    imageUri: string | null;
    location: { latitude: number; longitude: number } | null;
  }) => {
    try {
      let photoUri = undefined;
      if (taskData.imageUri) {
        photoUri = await api.uploadImage(taskData.imageUri);
      }

      const newTask = await api.createTask({
        title: taskData.title,
        location: taskData.location,
        photoUri: photoUri,
      });
      
      setTasks((prev) => [...prev, newTask]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo crear la tarea");
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      await api.updateTask(id, { completed: !task.completed });
    } catch (error) {
      // Revert if failed
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: task.completed } : t))
      );
      Alert.alert("Error", "No se pudo actualizar la tarea");
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistic update
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await api.deleteTask(id);
    } catch (error) {
      // Revert if failed
      setTasks(previousTasks);
      Alert.alert("Error", "No se pudo eliminar la tarea");
    }
  };

  if (!auth) {
    return (
      <View style={styles.container}>
        <Text>Error: AuthContext no encontrado</Text>
      </View>
    );
  }

  if (!userEmail) {
    return (
      <View style={styles.container}>
        <Text>Debes iniciar sesión primero.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NewTask onCreate={handleCreateTask} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={() => toggleTask(item.id)}
              onDelete={() => deleteTask(item.id)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
});






