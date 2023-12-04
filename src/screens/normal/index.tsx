import React, {useCallback, useRef} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BottomSheet} from '../../component';
import {NormalBottomSheetMethods} from '../../component/bottomSheet/normal';
import {lorem} from '../../constant';

export const NormalScreen: React.FC = () => {
  const blankBottomSheetRef = useRef<NormalBottomSheetMethods>(null);
  const exampleBottomSheetRef = useRef<NormalBottomSheetMethods>(null);
  const scrollViewBottomSheetRef = useRef<NormalBottomSheetMethods>(null);
  const flatListBottomSheetRef = useRef<NormalBottomSheetMethods>(null);

  const pressBlankBottomSheetHandler = useCallback(() => {
    blankBottomSheetRef.current?.expand();
  }, []);

  const pressExampleBottomSheetHandler = useCallback(() => {
    exampleBottomSheetRef.current?.expand();
  }, []);

  const pressScrollViewBottomSheetHandler = useCallback(() => {
    scrollViewBottomSheetRef.current?.expand();
  }, []);

  const pressFlatListBottomSheetHandler = useCallback(() => {
    flatListBottomSheetRef.current?.expand();
  }, []);

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <Button
            title="Blank"
            onPress={() => pressBlankBottomSheetHandler()}
          />
          <Button
            title="Example"
            onPress={() => pressExampleBottomSheetHandler()}
          />
          <Button
            title="ScrollView"
            onPress={() => pressScrollViewBottomSheetHandler()}
          />
          <Button
            title="Flatlist"
            onPress={() => pressFlatListBottomSheetHandler()}
          />
          <BottomSheet.Normal.Common
            ref={blankBottomSheetRef}
            snapTo={'40%'}
            backgroundColor={'white'}
            backDropColor={'black'}
          />
          <BottomSheet.Normal.Scroll
            ref={scrollViewBottomSheetRef}
            snapTo={'50%'}
            backgroundColor={'white'}
            backDropColor={'black'}>
            <View>
              <Text style={styles.text}>{lorem}</Text>
            </View>
          </BottomSheet.Normal.Scroll>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};
const styles = StyleSheet.create({
  text: {
    padding: 10,
    color: 'black',
  },
});
