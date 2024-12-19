import {
  Alert,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Avatar} from 'react-native-elements';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import defaultAvatar from '../img/avatar.png';
import {apiUrl, apiImage} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormUpload({route, navigation}) {
  const {kdkapal} = route.params;
  const {foto} = route.params;

  const [Pic, setPic] = useState(null);
  const [urlImage, setUrlImage] = useState();
  const [typeImage, setTypeImage] = useState();
  const [fileNameImage, setFileNameImage] = useState();

  const [IsUploadButtonDisabled, setIsUploadButtonDisabled] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (foto) {
      setPic(`${apiImage}${foto}`);
    }
  }, [foto]);

  const options = {
    title: 'select image',
    type: 'library',
    option: {
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: true,
      includeExtra: true,
    },
  };

  const setToastMsg = msg => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
  };

  const searchImage = async () => {
    setIsUploadButtonDisabled(true);

    const result = await launchImageLibrary(options, response => {
      if (response.didCancel) {
        setToastMsg('Cancel Selection Image');
        setIsUploadButtonDisabled(true);
      } else if (response.errorCode == 'permission') {
        setToastMsg('Not Permission');
        setIsUploadButtonDisabled(true);
      } else if (response.errorCode == 'others') {
        setToastMsg(response.errorMessage);
        setIsUploadButtonDisabled(true);
      } else if (response.assets[0].fileSize > 5000000) {
        Alert.alert('Maximum file 5MB', 'Please Choice Other', [{text: 'OK'}]);
        setIsUploadButtonDisabled(true);
      } else {
        setPic(response.assets[0].uri);
        setUrlImage(response.assets[0].uri);
        setTypeImage(response.assets[0].type);
        setFileNameImage(response.assets[0].fileName);
        setIsUploadButtonDisabled(false);
      }
      console.log(result);
    });
  };

  const takePicture = async () => {
    setIsUploadButtonDisabled(true);
    const result = await launchCamera(options, response => {
      if (response.didCancel) {
        setToastMsg('Cancel Selection Image');
        setIsUploadButtonDisabled(true);
      } else if (response.errorCode == 'permission') {
        setToastMsg('Not Permission');
        setIsUploadButtonDisabled(true);
      } else if (response.errorCode == 'others') {
        setToastMsg(response.errorMessage);
        setIsUploadButtonDisabled(true);
      } else if (
        response.assets &&
        response.assets.length > 0 &&
        response.assets[0].fileSize <= 4194304
      ) {
        const uri = response.assets[0].uri;
        setPic(uri);
        setUrlImage(uri);
        setTypeImage(response.assets[0].type);
        setFileNameImage(response.assets[0].fileName);

        setIsUploadButtonDisabled(false);
      } else {
        Alert.alert('Maximum File 4MB', 'Please Choice Other', [{text: 'OK'}]);
        setIsUploadButtonDisabled(true);
      }
    });
  };

  const doRemovePicture = () => {
    if (foto) {
      setPic(`${apiImage}${foto}`);
    } else {
      setPic('');
    }
    setIsUploadButtonDisabled(true);
  };

  const doUploadImage = async () => {
    checkToken();
    setLoading(true);
  };
   const checkToken = async () => {
     token = await AsyncStorage.getItem('userToken');
     if (!token) {
       navigation.navigate('Login');
     } else {
const formdata = new FormData();
formdata.append('_method', 'PUT');
formdata.append('foto', {
  uri: urlImage,
  type: typeImage,
  name: fileNameImage,
});

let res = await fetch(`${apiUrl}kapal/uploadImage/${kdkapal}`, {
  method: 'POST',
  body: formdata,
  headers: {
    'Content-Type': 'multipart/form-data;',
    Authorization: `Bearer ${token}`,
  },
});
let responseJson = await res.json();
setToastMsg(responseJson.message);
setLoading(false);
navigation.goBack();     }
   };
  return (
    <View
      style={{
        marginTop: 20,
      }}>
      <TouchableOpacity onPress={searchImage} underlayColor="rgba(0,0,0,0)">
        <Avatar
          size="xlarge"
          rounded
          source={Pic ? {uri: Pic} : defaultAvatar}
          containerStyle={{
            alignSelf: 'center',
            marginBottom: 10,
          }}
        />
      </TouchableOpacity>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          alignSelf:'center'
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: IsUploadButtonDisabled ? '#aaa' : '#658741', //ubah warna jika disable
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            borderRadius: 5,
            elevation: 3,
            marginHorizontal: 5,
          }}
          onPress={doUploadImage}
          disabled={IsUploadButtonDisabled}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 14,
            }}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              'Upload Foto'
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#193760',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            borderRadius: 5,
            elevation: 3,
            marginHorizontal: 5,
          }}
          onPress={takePicture}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 14,
            }}>
            Take Picture
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#D21312',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            borderRadius: 5,
            elevation: 3,
            marginHorizontal: 5,
          }}
          onPress={doRemovePicture}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 14,
            }}>
            Remove Picture
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
