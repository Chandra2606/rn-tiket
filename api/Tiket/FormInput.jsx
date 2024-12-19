import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {Button, Input} from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import ModalDataPenumpang from './ModalDataPenumpang';
import ModalDataKapal from './ModalDataKapal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from '../config';
import {useNavigation} from '@react-navigation/native';

export default function FormInput() {

  const navigation = useNavigation();
  const [modalPenumpangVisible, setModalPenumpangVisible] = useState(false);
  const [modalKapalVisible, setModalKapalVisible] = useState(false);
  const [kdtiket, setKdTiket] = useState('');
  const [tglmulai, setTglMulai] = useState(new Date());
  const [jam, setJam] = useState(new Date());
  const [selectPenumpang, setSelectedPenumpang] = useState({kdpenumpang: '', nama: ''});
  const [selectedKapal, setSelectedKapal] = useState({
    kode: '',
    nama: '',
    harga:'',
  });
  const [showPicker, setShowPicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('start');
  const [keterangan, setKeterangan] = useState('');
  const [harga, setHarga] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  


  const onPenumpangSelected = (kdpenumpang, nama) => {
    setSelectedPenumpang({kdpenumpang, nama});
    setModalPenumpangVisible(false); // Menutup modal setelah pemilihan
  };
  const onKapalSelected = (kode, nama, harga) => {
    setSelectedKapal({kode, nama, harga});
    setModalKapalVisible(false); // Menutup modal setelah pemilihan
  };

  const onChangeTime = (event, selectedTime) => {
    setShowPicker(Platform.OS === 'ios'); // Untuk iOS, tetap tampilkan picker
    const currentTime = selectedTime || new Date();
    if (currentPicker === 'start') {
      setJam(currentTime);
    }
  };
  const formatTime = date => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes}`;
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tglmulai;
    setDatePickerVisible(Platform.OS === 'ios');
    setTglMulai(currentDate);
  };
  const formatDate = date => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const modalSearchPenumpang = () => {
    setModalPenumpangVisible(true); // Buka hanya modal dosen
  };
  const modalSearchKapal = () => {
    setModalKapalVisible(true); // Buka hanya modal matakuliah
  };
  const submitServis = async () => {
    setLoading(true);
    setValidationErrors({});
    const tglDipilih = new Date(tglmulai);
    const dataToSend = {
      kdtiket: kdtiket, // Ambil dari state atau Input component
      penumpangkd: selectPenumpang.kdpenumpang,
      kapalkd: selectedKapal.kode,
      tgl: new Date(
        tglmulai.getFullYear(),
        tglmulai.getMonth(),
        tglmulai.getDate() + 1,
      )
        .toISOString()
        .split('T')[0], // Kurangi satu hari dari tanggal yang dipilih
      jam: formatTime(jam),
    };
    let token = await AsyncStorage.getItem('userToken');
    fetch(`${apiUrl}tiket`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          setLoading(false);
          // Jika ada kesalahan validasi, akan masuk ke sini
          if (response.status === 422) {
            // Handle validation errors
            let errors = {};
            Object.keys(data.errors).forEach(key => {
              errors[key] = data.errors[key][0]; // Ambil hanya pesan pertama untuk setiapfield;
            });
            setValidationErrors(errors);
          } else {
            throw new Error(
              data.message || 'Terjadi kesalahan saat menyimpan data.',
            );
          }
          return;
        }
        setLoading(false);
        Alert.alert('Berhasil', 'Data Tiket berhasil disimpan', [
          {
            text: 'Ok',
            onPress: () => {
              setKdTiket('');
              setSelectedPenumpang({kdpenumpang: '', nama: ''});
              setSelectedKapal({kode: '', nama: '', harga:''});
              setShowPicker(false);
              setHarga('');
              setJam(new Date());
              setValidationErrors({});
              navigation.navigate('DataTiket', {dataAdded: true});
            },
          },
        ]);
      })
      .catch(error => {
        // Handle failure
        console.log(`Gagal Simpan Data : ${error}`);
      });
  };
  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.container}>
        <Input
          value={kdtiket}
          onChangeText={setKdTiket}
          label="Kode Tiket"
          labelStyle={styles.labelInput}
          placeholder="Input Kode Tiket..."
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
          errorMessage={validationErrors.kdtiket}
        />
        <View style={styles.inputRow}>
          <View style={{flex: 4, marginRight: 10}}>
            <Input
              label="Kode Penumpang"
              labelStyle={styles.labelInput}
              placeholder="Cari Penumpang..."
              disabled={true}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              value={`${selectPenumpang.kdpenumpang} - ${selectPenumpang.nama}`}
              errorMessage={validationErrors.penumpangkd}
            />
          </View>
          <View style={{flex: 1}}>
            <Button
              title="Cari"
              containerStyle={styles.buttonContainer}
              buttonStyle={{
                height: 50,
                backgroundColor: '#65B741',
                borderRadius: 10,
              }}
              onPress={modalSearchPenumpang}
            />
            <ModalDataPenumpang
              isVisible={modalPenumpangVisible}
              onClose={() => setModalPenumpangVisible(false)}
              onPenumpangSelected={onPenumpangSelected} // Penumpangikan callback ke ModalDataPenumpang
            />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={{flex: 4, marginRight: 10}}>
            <Input
              label="Kode Kapal"
              labelStyle={styles.labelInput}
              placeholder="Cari Kapal..."
              disabled={true}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              value={`${selectedKapal.kode} - ${selectedKapal.nama}`}
              errorMessage={validationErrors.kapalkd}
            />
          </View>
          <View style={{flex: 1}}>
            <Button
              title="Cari"
              containerStyle={styles.buttonContainer}
              buttonStyle={{
                height: 50,
                backgroundColor: '#492e87',
                borderRadius: 10,
              }}
              onPress={modalSearchKapal}
            />

            <ModalDataKapal
              isVisible={modalKapalVisible}
              onClose={() => setModalKapalVisible(false)}
              onKapalSelected={onKapalSelected} // Penumpangikan callback ke
              ModalDataPenumpang
            />
          </View>
        </View>
        <Input
          value={`${selectedKapal.harga}`}
          onChangeText={setHarga}
          label="Harga Kapal"
          labelStyle={styles.labelInput}
          disabled={true}
          inputContainerStyle={styles.inputContainer}
          inputStyle={styles.inputText}
        />
        <View style={styles.dateContainer}>
          <Button
            title="Pilih Tanggal Keberangkatan"
            onPress={() => setDatePickerVisible(true)}
          />
          {datePickerVisible && (
            <DateTimePicker
              value={tglmulai}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <Text style={styles.dateDisplay}>
            Tanggal Keberangkatan: {formatDate(tglmulai)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setShowPicker(true);
            setCurrentPicker('start');
          }}>
          <Input
            label="Jam Keberangkatan"
            labelStyle={styles.labelInput}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.inputText}
            placeholder="Pilih Jam Keberangkatan"
            editable={false}
            value={jam.toLocaleTimeString().substring(0, 5)}
            errorMessage={validationErrors.jam}
          />
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={currentPicker === 'start' ? jam : ''}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeTime}
          />
        )}

        <Button
          title={loading ? 'Tunggu...' : 'Simpan Data'}
          disabled={loading}
          onPress={submitServis}
          buttonStyle={{marginHorizontal: 10}}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    marginBottom: 5,
  },
  labelInput: {
    color: '#7071e8',
    borderBottomColor: '#7071e8',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  labelInputHari: {
    color: '#7071e8',
    borderBottomColor: '#7071e8',
    marginBottom: 2,
    fontWeight: 'bold',
    paddingLeft: 10,
    fontSize: 16,
  },
  inputContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingLeft: 10,
    elevation: 3,
  },
  inputText: {
    color: '#000',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    marginRight: 10,
    marginTop: 25,
  },
  pickerContainer: {
    marginHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    elevation: 3,
    marginBottom: 20,
  },
  picker: {
    color: 'black',
    fontWeight: 'bold',
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
