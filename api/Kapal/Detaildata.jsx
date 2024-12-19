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
import defaultAvatar from '../img/avatar.png';
import ActionButton from './ActionButton';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailKapal = ({route}) => {
  const {kdkapal} = route.params;
  const [kapal, setKapal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const goToPageFormUpload = () => {
    navigation.navigate('FormUpload', {
      kdkapal: kdkapal,
      foto: kapal.foto_thumb,
    });
  };
  
  useEffect(() => {
    const unsubcribe = navigation.addListener('focus', () => {
      const fetchData = async () => {
        try {
          token = await AsyncStorage.getItem('userToken');
          const response = await fetch(`${apiUrl}kapal/${kdkapal}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const json = await response.json();
          setKapal(json);
        } catch (error) {
          setError('Tidak dapat memuat data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    });
    return unsubcribe;
  }, [navigation, kdkapal]);

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
          {kapal && (
            <Card>
              <Avatar
                size="xlarge"
                rounded
                source={
                  kapal.foto
                    ? {uri: `${apiImage}${kapal.foto_thumb}`}
                    : defaultAvatar
                }
                containerStyle={styles.avatarContainer}
                onPress={goToPageFormUpload}
              />
              <Card.Title style={styles.title}>
                {kapal.kdkapal}
              </Card.Title>
              <Card.Divider />
              <Text style={styles.detail}>Nama kapal:</Text>
              <Text style={styles.detailData}>
                {kapal.namakapal}
              </Text>
              <Text style={styles.detail}>Kapasita kapal:</Text>
              <Text style={styles.detailData}>
                {kapal.kapasitas}
              </Text>
              <Text style={styles.detail}>Fasilitas kapal:</Text>
              <Text style={styles.detailData}>{kapal.fasilitas}</Text>
              <Text style={styles.detail}>Harga:</Text>
              <Text style={styles.detailData}>{kapal.harga}</Text>
            </Card>
          )}
        </View>
      </ScrollView>
      <ActionButton kdkapal={kapal.kdkapal} />
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
export default DetailKapal;
