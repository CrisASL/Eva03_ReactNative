import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AuthContext } from "../components/context/auth-context";
import { api } from "../services/api";

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext no encontrado");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tu email y contraseña");
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Error", "El formato del correo electrónico no es válido");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isRegistering) {
        result = await api.register(email, password);
      } else {
        result = await api.login(email, password);
      }
      
      const { token } = result;
      await auth.login(email, token);
      
      const nombreUsuario = email.split("@")[0];
      Alert.alert(isRegistering ? "Registro exitoso" : "Inicio de sesión", `Bienvenido, ${nombreUsuario}!`);

      router.replace("/(tabs)");
    } catch (error: any) {
      let message = error.message || "Error al procesar la solicitud";
      if (message === "Invalid credentials") {
        message = "Credenciales inválidas";
      }
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? "Registrarse" : "Iniciar Sesión"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#aaa" />
        </Pressable>
      </View>

      <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isRegistering ? "Registrarse" : "Ingresar"}</Text>
        )}
      </Pressable>

      <Pressable onPress={() => setIsRegistering(!isRegistering)} style={styles.switchButton}>
        <Text style={styles.switchText}>
          {isRegistering
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

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
    marginBottom: 40,
    color: "#333",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 20,
  },
  switchText: {
    color: "#007bff",
    fontSize: 16,
  },
});


