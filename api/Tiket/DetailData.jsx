import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Card, Avatar} from 'react-native-elements';
import {apiImage, apiUrl} from '../config';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailTiket = ({route}) => {
  const {kdtiket} = route.params;
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

 

  useEffect(() => {
    const unsubcribe = navigation.addListener('focus', () => {
      const fetchData = async () => {
        try {
          token = await AsyncStorage.getItem('userToken');
          const response = await fetch(`${apiUrl}tiket/${kdtiket}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const json = await response.json();
          setMahasiswa(json);
        } catch (error) {
          setError('Tidak dapat memuat data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    });
    return unsubcribe;
  }, [navigation, kdtiket]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }
  if (error) {
    return <Text>{error}</Text>;
  }
  return (
    <View>
      <ScrollView>
        <View style={styles.container}>
          {mahasiswa && (
            <Card>
              <Card.Title style={styles.title}>
                {mahasiswa.kdtiket}
              </Card.Title>
              <Card.Divider />
              <Text style={styles.detail}>Kode / Nama Penumpang:</Text>
              <Text style={styles.detailData}>
                {mahasiswa.penumpangkd}/{mahasiswa.namapenumpang}
              </Text>
              <Text style={styles.detail}>Kode / Nama Kapal:</Text>
              <Text style={styles.detailData}>
                {mahasiswa.kapalkd}/{mahasiswa.namakapal}
              </Text>
              <Text style={styles.detail}>Tanggal Keberangkatan:</Text>
              <Text style={styles.detailData}>{mahasiswa.tgl}</Text>
              <Text style={styles.detail}>Jam Keberangkatan:</Text>
              <Text style={styles.detailData}>{mahasiswa.jam}</Text>
              <Text style={styles.detail}>Harga Tiket:</Text>
              <Text style={styles.detailData}>
                {mahasiswa.harga}
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detail: {
    fontSize: 14,
    marginBottom: 5,
    color: '#ccd',
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailData: {
    fontSize: 18,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'black',
    fontWeight: 'bold',
  },
});
export default DetailTiket;
