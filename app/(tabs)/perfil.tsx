import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../../components/context/auth-context"; // ajusta la ruta según tu estructura

export default function PerfilScreen() {
  const router = useRouter();
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext no encontrado");

  const handleLogout = () => {
    auth.logout(); // limpia el email del contexto
    router.replace("/LoginScreen"); // vuelve a la pantalla de login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <Text style={styles.info}>Correo: {auth.email}</Text>

      <Text style={styles.active}>Usuario activo ✅</Text>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
  active: {
    fontSize: 18,
    marginBottom: 20,
    color: "green",
    fontWeight: "600",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});


