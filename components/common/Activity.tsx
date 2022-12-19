import * as React from 'react';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { theme } from '../../theme/core/theme';

const Activity = ({color}) => (
  <ActivityIndicator animating={true} color={color || Colors.red800} />
);

export default Activity;