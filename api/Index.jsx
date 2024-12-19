import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Kapal from './Kapal/Navigasi';
import Penumpang from './Penumpang/Navigasi';
// import Matakuliah from './Matakuliah/Navigasi';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DataUser from './DataUser';
import NavTiket from './Tiket/NavTiket';

const Tab = createBottomTabNavigator();

export default function Index(props) {
  const {setUserToken} = props;
  return (
    <Tab.Navigator
      initialRouteName="Kapal"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Kapal') {
            iconName = focused ? 'boat' : 'boat-outline';
          } else if (route.name === 'Penumpang') {
            iconName = focused ? 'body' : 'body-outline';
          } else if (route.name === 'UserAccount') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Tiket') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          }
          return <IonIcon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2D9596',
        tabBarInactiveTintColor: '#164863',
      })}>
      <Tab.Screen
        name="Kapal"
        component={Kapal}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Penumpang"
        component={Penumpang}
        options={{headerShown: false}}
      />
      {/* <Tab.Screen
        name="Matakuliah"
        component={Matakuliah}
        options={{headerShown: false}}
      /> */}
      <Tab.Screen
        name="Tiket"
        component={NavTiket}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="UserAccount"
        options={{headerShown: false, title: 'User'}}>
        {props => <DataUser {...props} setUserToken={setUserToken} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
