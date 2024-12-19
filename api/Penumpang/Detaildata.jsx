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
import defaultAvatar from './img/avatar.png';
import ActionButton from './ActionButton';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailPenumpang = ({route}) => {
  const {kdpenumpang} = route.params;
  const [penumpang, setPenumpang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const goToPageFormUpload = () => {
    navigation.navigate('FormUpload', {
      kdpenumpang: kdpenumpang,
      foto: penumpang.foto_thumb,
    });
  };

  useEffect(() => {
    const unsubcribe = navigation.addListener('focus', () => {
      const fetchData = async () => {
        try {
          let token = await AsyncStorage.getItem('userToken');
          const response = await fetch(`${apiUrl}penumpang/${kdpenumpang}`, {
            headers: {
              Authorization: ` Bearer ${token}`,
            },
          });
          const json = await response.json();
          setPenumpang(json);
        } catch (error) {
          setError('Tidak dapat memuat data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    });
    return unsubcribe;
  }, [navigation, kdpenumpang]);
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
          {penumpang && (
            <Card>
              <Avatar
                size="xlarge"
                rounded
                source={
                  penumpang.foto
                    ? {uri: `${apiImage}${penumpang.foto_thumb}`}
                    : defaultAvatar
                }
                containerStyle={styles.avatarContainer}
                onPress={goToPageFormUpload}
              />
              <Card.Title style={styles.title}>{penumpang.kdpenumpang}</Card.Title>
              <Card.Divider />
              <Text style={styles.detail}>Nama:</Text>
              <Text style={styles.detailData}>{penumpang.namapenumpang}</Text>
              <Text style={styles.detail}>Jenkel:</Text>
              <Text style={styles.detailData}>
                {penumpang.jenkel == 'L' ? 'Laki-Laki' : 'Perempuan'}
              </Text>
              <Text style={styles.detail}>Alamat:</Text>
              <Text style={styles.detailData}>{penumpang.alamat}</Text>
              <Text style={styles.detail}>No HP/WA:</Text>
              <Text style={styles.detailData}>{penumpang.nohp}</Text>
            </Card>
          )}
        </View>
      </ScrollView>
      <ActionButton kdpenumpang={penumpang.kdpenumpang} />
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
export default DetailPenumpang;
