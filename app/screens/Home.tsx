import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import { Product } from '../model/Product';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../App';
import LocalDB from '../persistance/localdb';
import WebServiceParams from '../WebServiceParams';

type HomeScreenProps = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRoute = RouteProp<RootStackParamList, 'Home'>;

type HomeProps = {
  navigation: HomeScreenProps;
  route: HomeScreenRoute;
};

function Home({ navigation }: HomeProps): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const productItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.push('ProductDetails', { product: item })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Text style={styles.itemTitle}>{item.nombre}</Text>
          <Text style={styles.itemDetails}>Precio: $ {item.precio.toFixed(2)}</Text>
        </View>
        <Text
          style={[
            styles.itemBadge,
            item.currentStock < item.minStock ? styles.itemBadgeError : null,
          ]}
        >
          {item.currentStock}
        </Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    LocalDB.init();
    navigation.addListener('focus', async () => {
      try {
        const response = await fetch(
          `http://${WebServiceParams.host}:${WebServiceParams.port}/productos`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'text/plain',
            },
          },
        );
        setProducts(await response.json());
      } catch (error) {
        console.error(error);
      }
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={products}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.welcomeText}>Bienvenido a Control de Inventario</Text>
            <Image 
              source={require('../assets/inventario.png')}
              style={styles.welcomeImage}
            />
          </View>
        }
        renderItem={productItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1E1F28',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: 35,
    color: '#F7F7F7',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#FF6F61',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  listContainer: {
    padding: 16,
  },
  productItem: {
    padding: 16,
    borderBottomColor: '#3E4049',
    borderBottomWidth: 1,
    backgroundColor: '#2A2C36',
    borderRadius: 10,
    marginVertical: 8,
  },
  itemTitle: {
    fontSize: 20,
    color: '#F7F7F7',
  },
  itemDetails: {
    fontSize: 16,
    color: '#A5A6A8',
  },
  itemBadge: {
    fontSize: 20,
    color: '#FF6F61',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  itemBadgeError: {
    color: '#FF3B30',
  },
});

export default Home;
