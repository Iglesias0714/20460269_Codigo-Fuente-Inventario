import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { Product } from '../model/Product';
import LocalDB from '../persistance/localdb';

export type Params = {
  product: Product;
};

export type Props = {
  route: RouteProp<RootStackParamList, 'ProductDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'ProductDetails'>;
};

function ProductDetails({ route, navigation }: Props): React.JSX.Element {
  const [product, setProduct] = useState<Product | null>(null);
  const [entrada, setEntrada] = useState<string>('');
  const [salida, setSalida] = useState<string>('');
  const [minStock, setMinStock] = useState<string>('');
  const [maxStock, setMaxStock] = useState<string>('');
  const [showStockOptions, setShowStockOptions] = useState<boolean>(false);

  useEffect(() => {
    const currentProduct = route.params.product;
    setProduct(currentProduct);
    setMinStock(currentProduct.minStock.toString());
    setMaxStock(currentProduct.maxStock.toString());
  }, [route]);

  const updateStock = async (type: 'entrada' | 'salida') => {
    if (!product) return;

    const value = type === 'entrada' ? parseInt(entrada) : parseInt(salida);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Error', 'Ingrese un valor válido.');
      return;
    }

    const newStock = type === 'entrada' ? product.currentStock + value : product.currentStock - value;
    if (newStock < 0) {
      Alert.alert('Error', 'El stock no puede ser negativo.');
      return;
    }

    try {
      const db = await LocalDB.connect();
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE productos SET currentStock = ? WHERE id = ?',
          [newStock, product.id],
          () => {
            setProduct({ ...product, currentStock: newStock });
            setEntrada('');
            setSalida('');
            Alert.alert('Éxito', 'Stock actualizado correctamente.');
          },
          (tx, error) => {
            console.error(error);
            Alert.alert('Error', 'No se pudo actualizar el stock.');
          }
        );
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar a la base de datos.');
    }
  };

  const updateMinMaxStock = async () => {
    if (!product) return;

    const minStockValue = parseInt(minStock);
    const maxStockValue = parseInt(maxStock);

    if (isNaN(minStockValue) || isNaN(maxStockValue) || minStockValue < 0 || maxStockValue < 0 || minStockValue > maxStockValue) {
      Alert.alert('Error', 'Ingrese valores válidos para el stock mínimo y máximo.');
      return;
    }

    try {
      const db = await LocalDB.connect();
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE productos SET minStock = ?, maxStock = ? WHERE id = ?',
          [minStockValue, maxStockValue, product.id],
          () => {
            setProduct({ ...product, minStock: minStockValue, maxStock: maxStockValue });
            Alert.alert('Éxito', 'Stock mínimo y máximo actualizado correctamente.');
          },
          (tx, error) => {
            console.error(error);
            Alert.alert('Error', 'No se pudo actualizar el stock mínimo y máximo.');
          }
        );
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar a la base de datos.');
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      {product && (
        <View style={styles.container}>
          <Text style={styles.header}>{product.nombre}</Text>
          <View style={styles.row}>
            <Text style={[styles.text, styles.col]}>Existencias:</Text>
            <Text style={[styles.text, styles.colAuto]}>
              <Text
                style={
                  product.currentStock < product.minStock
                    ? styles.stockError
                    : null
                }
              >
                {product.currentStock}
              </Text>{' '}
              / {product.maxStock}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.text, styles.col]}>Precio:</Text>
            <Text style={[styles.text, styles.colAuto]}>
              $ {product.precio.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowStockOptions(!showStockOptions)}
          >
            <Text style={styles.toggleButtonText}>
              {showStockOptions ? 'Ocultar Opciones de Stock' : 'Mostrar Opciones de Stock'}
            </Text>
          </TouchableOpacity>
          {showStockOptions && (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Entradas"
                  placeholderTextColor="#828894"
                  keyboardType="numeric"
                  value={entrada}
                  onChangeText={setEntrada}
                />
                <TouchableOpacity style={styles.button} onPress={() => updateStock('entrada')}>
                  <Text style={styles.buttonText}>Actualizar Entrada</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.textInput}
                  placeholder="Salidas"
                  placeholderTextColor="#828894"
                  keyboardType="numeric"
                  value={salida}
                  onChangeText={setSalida}
                />
                <TouchableOpacity style={styles.button} onPress={() => updateStock('salida')}>
                  <Text style={styles.buttonText}>Actualizar Salida</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Stock Mínimo"
                  placeholderTextColor="#828894"
                  keyboardType="numeric"
                  value={minStock}
                  onChangeText={setMinStock}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Stock Máximo"
                  placeholderTextColor="#828894"
                  keyboardType="numeric"
                  value={maxStock}
                  onChangeText={setMaxStock}
                />
                <TouchableOpacity style={styles.button} onPress={updateMinMaxStock}>
                  <Text style={styles.buttonText}>Actualizar Stock Mín/Máx</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('ProductAdd')}>
            <Text style={styles.addButtonText}>Añadir más productos</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#1E1F28',
    padding: 16,
  },
  container: {
    backgroundColor: '#2A2C36',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    fontSize: 28,
    color: '#F7F7F7',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  col: {
    flexGrow: 1,
    color: '#F7F7F7',
  },
  colAuto: {
    color: '#F7F7F7',
  },
  stockError: {
    color: 'red',
  },
  text: {
    fontSize: 18,
    color: '#F7F7F7',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  inputContainer: {
    marginTop: 20,
  },
  textInput: {
    borderBottomWidth: 1,
    borderRadius: 8,
    backgroundColor: '#3E4049',
    color: '#F7F7F7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#FF6F61',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#F7F7F7',
    fontSize: 16,
  },
  toggleButton: {
    backgroundColor: '#FF6F61',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 10,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#F7F7F7',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#FF6F61',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#F7F7F7',
    fontSize: 16,
  },
});

export default ProductDetails;
