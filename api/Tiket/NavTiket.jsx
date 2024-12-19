import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import FormInput from './FormInput';
import DataTiket from './DataTiket';
import DetailTiket from './DetailData';
export default function NavTiket() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#2D9596"
        translucent={true}
      />

      <Stack.Navigator initialRouteName="DataTiket">
        <Stack.Screen
          name="DataTiket"
          component={DataTiket}
          options={{
            headerTitle: 'Data Tiket',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#2D9596',
            },
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="DetailData"
          component={DetailTiket}
          options={{
            headerTitle: 'Detail Tiket',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#2D9596',
            },
          }}
        />
        <Stack.Screen
          name="FormInput"
          component={FormInput}
          options={{
            headerTitle: 'Input Tiket',
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
