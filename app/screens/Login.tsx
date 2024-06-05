import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1E1F28',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#2A2C36',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#F7F7F7',
    marginBottom: 24,
  },
  textInput: {
    borderBottomWidth: 1,
    borderRadius: 8,
    backgroundColor: '#3E4049',
    color: '#F7F7F7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#FF6F61',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 20,
  },
  buttonText: {
    color: '#F7F7F7',
    fontSize: 16,
  },
  placeholderTextColor: {
    color: '#828894',
  },
});

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

type LoginProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

function Login({ navigation }: LoginProps): React.JSX.Element {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const btnIngresarOnPress = async function () {
    if (usuario && contrasena) {
      navigation.navigate('Home');
      return;
    }
    Alert.alert('Fallido', 'Datos incorrectos');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Usuario"
          placeholderTextColor="#828894"
          onChangeText={(u) => setUsuario(u)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Contraseña"
          placeholderTextColor="#828894"
          secureTextEntry={true}
          onChangeText={(p) => setContrasena(p)}
        />
        <TouchableOpacity style={styles.button} onPress={btnIngresarOnPress}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default Login;
