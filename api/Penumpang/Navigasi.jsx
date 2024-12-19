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
    <>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#2D9596"
        translucent={true}
      />
      <Stack.Navigator initialRouteName="DataPenumpang">
        <Stack.Screen
          name="DataPenumpang"
          component={Data}
          options={{
            headerTitle: 'Data Penumpang',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#2D9596',
            },
          }}
        />
        <Stack.Screen
          name="DetailPenumpang"
          component={DetailData}
          options={{
            headerTitle: 'Detail Penumpang',
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
            headerTitle: 'Tambah Penumpang',
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
            headerTitle: 'Edit Penumpang',
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
            headerTitle: 'Update Foto Penumpang',
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
