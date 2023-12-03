import {NormalBottomSheet} from './Normal';
import {ScrollBottomSheet} from './Scroll';

export const BottomSheet = Object.assign(NormalBottomSheet, {
  Normal: {
    Common: NormalBottomSheet,
  },
  Scroll: ScrollBottomSheet,
});
