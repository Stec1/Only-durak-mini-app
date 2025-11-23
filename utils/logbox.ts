import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Deep imports from the "react-native" package are deprecated',
  'Require cycle:',
  'Non-serializable values were found in the navigation state',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  'ViewPropTypes will be removed',
  'new NativeEventEmitter',
]);
