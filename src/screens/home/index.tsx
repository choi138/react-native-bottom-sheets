import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Button} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigation().navigate as (screen: string) => void;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Button
        title="Go to Normal Bottom Sheet"
        onPress={() => navigate('Normal')}
      />
      <Button
        title="Go to Scroll Bottom Sheet"
        onPress={() => navigate('Scroll')}
      />
    </SafeAreaView>
  );
};
