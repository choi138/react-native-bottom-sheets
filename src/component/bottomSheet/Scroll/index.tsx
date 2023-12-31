import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useCallback, useImperativeHandle, useState} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  AnimatedScrollViewProps,
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

interface ScrollBottomSheetProps extends AnimatedScrollViewProps {
  children?: React.ReactNode;
  scrollHeight: number;
}

export type ScrollBottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

export const ScrollBottomSheet = React.forwardRef<
  ScrollBottomSheetRefProps,
  ScrollBottomSheetProps
>(({children, scrollHeight, ...rest}: ScrollBottomSheetProps, ref) => {
  const inset = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const active = useSharedValue(false);
  const [enableScroll, setEnableScroll] = useState(false);
  const scrollBegin = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const scrollTo = useCallback(
    (destination: number) => {
      'worklet';
      active.value = destination !== 0;

      translateY.value = withSpring(destination, {
        damping: 100,
        stiffness: 400,
      });
    },
    [active, translateY],
  );

  const isActive = useCallback(() => {
    'worklet';
    return active.value;
  }, [active]);

  useImperativeHandle(ref, () => ({scrollTo, isActive}), [scrollTo, isActive]);

  const context = useSharedValue({y: 0});
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {y: translateY.value};
    })
    .onUpdate(event => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      if (event.translationY > 0 && scrollY.value === 0) {
        runOnJS(setEnableScroll)(false);
      }
    })
    .onEnd(() => {
      if (translateY.value > scrollHeight) {
        scrollTo(0);
      } else if (translateY.value < context.value.y) {
        scrollTo(-SCREEN_HEIGHT + (inset.top + 10));
        runOnJS(setEnableScroll)(true);
      } else {
        runOnJS(setEnableScroll)(false);
        scrollTo(scrollHeight);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      Extrapolate.CLAMP,
    );

    return {
      borderRadius,
      transform: [{translateY: translateY.value}],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active.value ? 1 : 0),
    };
  }, []);

  const rBackdropProps = useAnimatedProps(() => {
    return {
      pointerEvents: active.value ? 'auto' : 'none',
    } as any;
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag: event => {
      scrollBegin.value = event.contentOffset.y;
    },
    onMomentumEnd: event => {
      if (event.contentOffset.y === 0) {
        runOnJS(setEnableScroll)(true);
      }
    },
    onEndDrag: event => {
      if (event.contentOffset.y === 0) {
        runOnJS(setEnableScroll)(false);
        scrollTo(scrollHeight);
      }
    },
  });

  return (
    <>
      <Animated.View
        onTouchStart={() => {
          scrollTo(0);
          runOnJS(setEnableScroll)(false);
        }}
        animatedProps={rBackdropProps}
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.4)',
            paddingBottom: inset.bottom,
          },
          rBackdropStyle,
        ]}
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
          <View style={styles.line} />
          <GestureDetector gesture={gesture}>
            <Animated.ScrollView
              {...rest}
              scrollEnabled={enableScroll}
              bounces={false}
              scrollEventThrottle={16}
              onScroll={onScroll}>
              {children}
            </Animated.ScrollView>
          </GestureDetector>
        </Animated.View>
      </GestureDetector>
    </>
  );
});

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
});
