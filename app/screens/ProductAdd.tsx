import React, {useState} from 'react';
import {Button, SafeAreaView, Text, TextInput} from 'react-native';
import LocalDB from '../persistance/localdb';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import WebServiceParams from '../WebServiceParams';

export default function ProductAdd(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [nombre, setNombre] = useState<string>('');
  const [precio, setPrecio] = useState<string>('0');
  const [minStock, setMinStock] = useState<string>('0');

  const btnGuardarOnPress = async () => {
    const db = await LocalDB.connect();
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO productos (nombre, precio, minStock) VALUES (?, ?, ?)',
        [nombre, precio, minStock],
      );
      navigation.goBack();
    });
    const response = await fetch(
      `http://${WebServiceParams.host}:${WebServiceParams.port}/productos`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({nombre, precio, minStock}),
      },
    );
  };

  return (
    <SafeAreaView>
      <Text>Nombre</Text>
      <TextInput onChangeText={t => setNombre(t)} />
      <Text>Precio</Text>
      <TextInput onChangeText={t => setPrecio(t)} />
      <Text>Min. Stock</Text>
      <TextInput onChangeText={t => setMinStock(t)} />
      <Button title="Guardar" onPress={btnGuardarOnPress} />
    </SafeAreaView>
  );
}
