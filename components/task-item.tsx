import { Button, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Task } from "../utils/types";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const getImageUrl = (uri: string) => {
    if (uri.startsWith("http")) return uri;
    return `${process.env.EXPO_PUBLIC_API_URL}${uri}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onToggle}>
          <Text style={styles.checkbox}>
            {task.completed ? "✅ " : "⬜ "}
          </Text>
        </Pressable>
        <Text style={styles.title}>
          {task.title}
        </Text>
      </View>

      {task.photoUri && (
        <Image source={{ uri: getImageUrl(task.photoUri) }} style={styles.image} />
      )}

      {task.location && (
        <Text style={styles.location}>
          Ubicación: {task.location.latitude.toFixed(4)}, {task.location.longitude.toFixed(4)}
        </Text>
      )}

      <View style={styles.buttons}>
        <Button title="Eliminar" color="red" onPress={onDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  checkbox: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    flex: 1,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginVertical: 10,
  },
  location: {
    fontStyle: "italic",
    marginBottom: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

