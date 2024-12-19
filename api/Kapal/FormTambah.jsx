import React, {useState} from 'react';
import {ScrollView, StyleSheet, Alert, View, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {apiUrl} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FormTambah = () => {
  const [kode, setKode] = useState('');
  const [namaKapal, setNamaKapal] = useState('');
  const [kapasitas, setKapasitas] = useState('');
  const [fasilitas, setFasilitas] = useState('');
  const [harga, setHarga] = useState('');
  // const [hargaJual, setHargaJual] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const navigation = useNavigation();
  const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  let token;
  const submitForm = () => {
    checkToken();
    setIsSaving(true);
    setValidationErrors({});
  };

  const checkToken = async () => {
    token = await AsyncStorage.getItem('userToken');
    if (!token) {
      navigation.navigate('Login');
    } else {
      const formData = {
        kdkapal: kode,
        namakapal: namaKapal,
        kapasitas: kapasitas,
        fasilitas: fasilitas,
        harga: harga,
      };
      fetch(`${apiUrl}kapal`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
        .then(async response => {
          const data = await response.json();
          if (!response.ok) {
            setIsSaving(false);
            //jika ada kesalahan validasi,akan masuk ke sini
            if (response.status === 422) {
              //Handle validation errors
              let errors = {};
              Object.keys(data.errors).forEach(key => {
                errors[key] = data.errors[key][0]; //Ambil hanya pesan pertama untuk setiap field
              });
              setValidationErrors(errors);
            } else {
              //JIKA ada jenis error lain,throw error untuk menangkap di catch block
              throw new Error(
                data.message || 'Terjadi kesalahan saat menyimpan data.',
              );
            }
            //jangan lupa untuk return disini untuk menghentikan eksekusi lebih lanjut
            return;
          }
          setIsSaving(false);
          //jika tidak ada error,maka tampilkan pesan sukse
          Alert.alert('Success', 'Data kapal berhasil ditambahkan', [
            {
              text: 'ok',
              onPress: () =>
                navigation.navigate('DataKapal', {dataAdded: true}),
            },
          ]);
        })
        .catch(error => {
          //handle failure
          setIsSaving(false);
          Alert.alert('Error', error.toString());
        });
    }
  };
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tanggalLahir;
    setDatePickerVisible(Platform.OS === 'ios');
    setTanggalLahir(currentDate);
  };
  const formatDate = date => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <Input
        placeholder="Kode kapal"
        value={kode}
        onChangeText={setKode}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        // leftIcon={<Icon name="user-circle" size={24} color="black" />}
        errorMessage={validationErrors.kdkapal}
      />

      <Input
        placeholder="Nama kapal"
        value={namaKapal}
        onChangeText={setNamaKapal}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        // leftIcon={<Icon name="user" size={24} color="black" />}
        errorMessage={validationErrors.namaKapal}
      />

      <Input
        placeholder="Kapasitas kapal"
        value={kapasitas}
        onChangeText={setKapasitas}
        // leftIcon={<Icon name="home" size={24} color="black" />}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.kapasitas}
        keyboardType="number-pad"
      />

      <Input
        placeholder="Fasilitas Kapal"
        value={fasilitas}
        onChangeText={setFasilitas}
        // leftIcon={<Icon name="map-marker-alt" size={24} color="black" />}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.fasilitaskapal}
      />

      <Input
        placeholder="Harga Tiket"
        value={harga}
        onChangeText={setHarga}
        // leftIcon={<Icon name="phone" size={24} color="black" />}
        placeholderTextColor="#888"
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
        errorMessage={validationErrors.harga}
        keyboardType="number-pad"
      />

      <Button
        title="Simpan Data"
        onPress={submitForm}
        buttonStyle={styles.submitButton}
        titleStyle={styles.submitTitle}
        loading={isSaving}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 30,
  },
  container: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingLeft: 10,
  },
  inputText: {
    color: '#000',
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    marginHorizontal: 10,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#2D9596',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
  },
  submitTitle: {
    color: '#fff', //warna text tombol
  },
  dateContainer: {
    marginBottom: 20,
    marginHorizontal: 10,
  },
  dateDisplay: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default FormTambah;
