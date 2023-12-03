import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {ScrollScreen, HomeScreen, NormalScreen} from './screens';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createStackNavigator();

export const Router: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Normal" component={NormalScreen} />
        <Stack.Screen name="Scroll" component={ScrollScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
