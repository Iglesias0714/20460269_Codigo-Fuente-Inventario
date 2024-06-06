import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LocalDB from '../persistance/localdb';
import { NavigationProp, useNavigation, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

export default function ProductAdd(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [nombre, setNombre] = useState<string>('');
  const [precio, setPrecio] = useState<string>('0');
  const [minStock, setMinStock] = useState<string>('0');

  const btnGuardarOnPress = async () => {
    if (!nombre || !precio || !minStock) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const db = await LocalDB.connect();
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO productos (nombre, precio, minStock) VALUES (?, ?, ?)',
          [nombre, parseFloat(precio), parseInt(minStock)],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              tx.executeSql(
                'SELECT * FROM productos WHERE id = ?',
                [results.insertId],
                (tx, results) => {
                  if (results.rows.length > 0) {
                    const newProduct = results.rows.item(0);
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 1,
                        routes: [
                          { name: 'Home' },
                          { name: 'ProductDetails', params: { product: newProduct } },
                        ],
                      })
                    );
                  }
                }
              );
            }
          },
          (tx, error) => {
            console.error(error);
            Alert.alert('Error', 'No se pudo guardar el producto');
          }
        );
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar a la base de datos');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Agregar Producto</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nombre"
          placeholderTextColor="#828894"
          onChangeText={t => setNombre(t)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Precio"
          placeholderTextColor="#828894"
          keyboardType="numeric"
          onChangeText={t => setPrecio(t)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Min. Stock"
          placeholderTextColor="#828894"
          keyboardType="numeric"
          onChangeText={t => setMinStock(t)}
        />
        <TouchableOpacity style={styles.button} onPress={btnGuardarOnPress}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
    fontSize: 28,
    color: '#F7F7F7',
    marginBottom: 24,
    fontWeight: 'bold',
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
});
