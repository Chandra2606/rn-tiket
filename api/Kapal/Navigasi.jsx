import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Data from './Data';
import DetailData from './Detaildata';
import {StatusBar} from 'react-native';
import FormTambah from './FormTambah';
import FormEdit from './FormEdit';
import FormUpload from './FormUpload';

export default function Navigasi() {
  const Stack = createNativeStackNavigator();
  return (
    // <NavigationContainer independent={true}>
    <>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#2D9596"
        translucent={true}
      />
      <Stack.Navigator initialRouteName="DataKapal">
        <Stack.Screen
          name="DataKapal"
          component={Data}
          options={{
            headerTitle: 'Data Kapal',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#2D9596',
            },
          }}
        />
        <Stack.Screen
          name="DetailKapal"
          component={DetailData}
          options={{
            headerTitle: 'Detail Kapal',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#2D9596',
            },
          }}
        />
        <Stack.Screen
          name="FormTambah"
          component={FormTambah}
          options={{
            headerTitle: 'Tambah Kapal',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#2D9596',
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="FormEdit"
          component={FormEdit}
          options={{
            headerTitle: 'Edit Kapal',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#2D9596',
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="FormUpload"
          component={FormUpload}
          options={{
            headerTitle: 'Update Foto Kapal',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#2D9596',
            },
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </>
  );
}

const styles = StyleSheet.create({});
