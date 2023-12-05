import React, {useCallback, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ScrollBottomSheetRefProps} from '../../component/bottomSheet/Scroll';
import {BottomSheet} from '../../component';
import {lorem} from '../../constant';

const SCROLL_HEIGHT = -500;

export const ScrollScreen: React.FC = () => {
  const ref = useRef<ScrollBottomSheetRefProps>(null);

  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(SCROLL_HEIGHT);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onPress} />
        <BottomSheet.Scroll ref={ref} scrollHeight={SCROLL_HEIGHT}>
          <View style={{height: 1000, width: '100%'}}>
            <Text style={styles.text}>{lorem}</Text>
          </View>
        </BottomSheet.Scroll>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 50,
    borderRadius: 25,
    aspectRatio: 1,
    backgroundColor: 'gray',
    opacity: 0.6,
  },
  text: {
    padding: 10,
    color: 'black',
  },
});
