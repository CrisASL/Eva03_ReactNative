# Welcome to Eva03 React Native 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Equipo de Desarrollo

- **Cristian Salas**: Lider del Equipo y desarrollador
- **Popi**: Desarrollador 

[![Link video Youtube] https://youtube.com/shorts/5gYKUBaQDhM?feature=share

## Uso de IA

Esta aplicación móvil ha sido desarrollada en React Native y utiliza ChatGPT como asistencia en el desarrollo para generar contenido, corregir errores y optimizar la estructura del código.

La aplicación permite a los usuarios crear y gestionar tareas personales con las siguientes características:

- Título de la tarea
- Imagen asociada (cámara o galería)
- Ubicación opcional (latitud y longitud)
- Estado de completitud (pendiente o completada)

Se implementó persistencia de datos usando AsyncStorage, de modo que cada usuario mantiene sus tareas incluso después de cerrar la sesión. La aplicación identifica a los usuarios mediante correo electrónico y gestiona las tareas de forma individual.

Se construyó una estructura organizada utilizando componentes, layouts, y navegación con Expo Router, además de un sistema de autenticación básico mediante AuthContext.

## Documentación Técnica

### 1. Envío de Credenciales al Backend

Las credenciales (email y contraseña) se envían al backend a través del servicio `api.ts`. Específicamente en las funciones `login` y `register`.

- **Archivo**: `services/api.ts`
- **Método**: `POST`
- **Endpoint**: `/auth/login` y `/auth/register`
- **Cuerpo**: JSON con `{ email, password }`

```typescript
// Ejemplo de llamada en services/api.ts
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
```

### 2. Almacenamiento del Token de Autenticación

El token JWT recibido del backend se almacena localmente en el dispositivo utilizando `AsyncStorage`. Esto permite mantener la sesión del usuario activa.

- **Archivo**: `components/context/auth-context.tsx`
- **Clave**: `userToken`

```typescript
// Guardado en AuthProvider
const login = async (userEmail: string, userToken: string) => {
  // ...
  await AsyncStorage.setItem("userToken", userToken);
};
```

### 3. Protección de Rutas

El acceso a las rutas protegidas se gestiona en el `RootLayout` (`app/_layout.tsx`). Se verifica si existe un usuario autenticado (email en el contexto). Si no hay usuario, se muestra la pantalla de Login; de lo contrario, se permite el acceso a las pestañas principales `(tabs)`.

- **Archivo**: `app/_layout.tsx`

```typescript
// Lógica en InnerLayout
{!auth?.email ? (
  <Stack.Screen name="LoginScreen" options={{ title: 'Login' }} />
) : (
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
)}
```

### 4. Manejo de Errores de la API

Los errores devueltos por la API se capturan en los bloques `try-catch` dentro de `services/api.ts` y se propagan a la interfaz de usuario. En `LoginScreen.tsx`, se interceptan errores específicos como "Invalid credentials" para mostrar mensajes amigables al usuario ("Credenciales inválidas").

- **Archivos**: `services/api.ts` y `app/LoginScreen.tsx`

```typescript
// Ejemplo en LoginScreen.tsx
} catch (error: any) {
  let message = error.message || "Error al procesar la solicitud";
  if (message === "Invalid credentials") {
    message = "Credenciales inválidas";
  }
  Alert.alert("Error", message);
}
```

### 5. Variables de Entorno

La aplicación utiliza variables de entorno para configurar la URL de la API. Esta se define en el archivo `.env` (o similar) y se accede a través de `process.env`.

- **Variable**: `EXPO_PUBLIC_API_URL`

```typescript
EXPO_PUBLIC_API_URL=https://todo-list.dobleb.cl
```

## Funcionalidades principales

1. Crear tareas:
   - Ingresar título
   - Adjuntar imagen desde cámara o galería
   - Guardar ubicación actual (opcional)

2. Visualizar tareas:
   - Listado de tareas por usuario
   - Indicador de completitud (✅ o ⬜)

3. Modificar tareas:
   - Marcar/completar tareas (interactivo desde el icono)
   - Eliminar tareas  

4. Persistencia de datos:

   - Todas las tareas se almacenan en AsyncStorage

   - Se cargan automáticamente al iniciar sesión    

5. Autenticación básica:

   - Iniciar sesión con correo electrónico

  
