import {NormalBottomSheet, NormalBottomSheetScrollView} from './normal';
import {ScrollBottomSheet} from './Scroll';

export const BottomSheet = Object.assign(NormalBottomSheet, {
  Normal: {
    Common: NormalBottomSheet,
    Scroll: NormalBottomSheetScrollView,
  },
  Scroll: ScrollBottomSheet,
});
