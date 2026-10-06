import * as Haptics from 'expo-haptics';
import type { BottomTabBarButtonProps } from 'expo-router/js-tabs';
import { Pressable } from 'react-native';

export function HapticTab(
  props: BottomTabBarButtonProps
) {
  const {
    ref: _ref,
    onPressIn,
    ...rest
  } = props as any;

  return (
    <Pressable
      {...rest}
      onPressIn={(event) => {
        if (
          process.env.EXPO_OS === 'ios'
        ) {
          Haptics.impactAsync(
            Haptics
              .ImpactFeedbackStyle
              .Light
          );
        }

        onPressIn?.(event);
      }}
    />
  );
}