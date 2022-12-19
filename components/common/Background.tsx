import React, { memo } from 'react';
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import { theme } from '../../theme/core/theme';
import { SCREEN_WIDTH } from "../../utilities/constants"
type Props = {
  children: React.ReactNode;
};

const Background = ({ children }: Props) => (
  <ImageBackground
    source={require('../../assets/BRAND_PATTERN_dark.png')}
    resizeMode="repeat"
    style={styles.background}
  >
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {children}
    </KeyboardAvoidingView>
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%', 
    backgroundColor: '#645041',
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: SCREEN_WIDTH * 0.8,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center', 
  },
});

export default memo(Background);
