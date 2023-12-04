import React, {
  ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BackDrop} from '../BackDrop';

type Props = {
  snapTo: string;
  children?: ReactNode;
  backgroundColor: string;
  backDropColor: string;
};

export interface NormalBottomSheetMethods {
  expand: () => void;
  close: () => void;
}

// forwardRef는 ref를 전달하기 위해 사용.
export const NormalBottomSheet = forwardRef<NormalBottomSheetMethods, Props>(
  ({snapTo, children, backgroundColor, backDropColor}: Props, ref) => {
    const inset = useSafeAreaInsets();
    const {height} = Dimensions.get('screen');
    const percentage = parseFloat(snapTo.replace('%', '')) / 100; // 50% -> 0.5
    const closeHeight = height;
    const openHeight = height - height * percentage; // percentage만큼 높이를 줄임. 632 - 632 * 0.5 = 316
    const topAnimation = useSharedValue(closeHeight);
    const context = useSharedValue(0);

    const expand = useCallback(() => {
      'worklet';
      topAnimation.value = withTiming(openHeight);
    }, [openHeight, topAnimation]);

    const close = useCallback(() => {
      'worklet';
      topAnimation.value = withTiming(closeHeight);
    }, [closeHeight, topAnimation]);

    useImperativeHandle(
      ref,
      () => ({
        expand,
        close,
      }),
      [expand, close],
    );

    const animationStyle = useAnimatedStyle(() => {
      const top = topAnimation.value;
      return {top};
    });

    const pan = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value;
      })
      .onUpdate(event => {
        if (event.translationY < 0) {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          topAnimation.value = withSpring(context.value + event.translationY, {
            damping: 100,
            stiffness: 400,
          });
        }
      })
      .onEnd(() => {
        if (topAnimation.value > openHeight + 50) {
          topAnimation.value = withSpring(closeHeight, {
            damping: 100,
            stiffness: 400,
          });
        } else {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          });
        }
      });

    return (
      <>
        <BackDrop
          topAnimation={topAnimation}
          openHeight={openHeight}
          closeHeight={closeHeight}
          backDropColor={backDropColor}
          close={close}
        />
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.container,
              animationStyle,
              {
                backgroundColor: backgroundColor,
                paddingBottom: inset.bottom,
              },
            ]}>
            <View style={styles.lineContainer}>
              <View style={styles.line} />
            </View>
            {children}
          </Animated.View>
        </GestureDetector>
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // position: 'absolute', left: 0, right: 0, top: 0, bottom: 0
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 9999,
  },
  lineContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  line: {
    width: 50,
    height: 4,
    backgroundColor: 'gray',
    borderRadius: 20,
  },
});
