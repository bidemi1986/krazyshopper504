import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image source={require('../../assets/Logo3/LOGO_INVERT.png')} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 265,
    height: 56.25,
    marginBottom: 12,
  },
});

export default memo(Logo);
