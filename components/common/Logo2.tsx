import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image source={require('../../assets/Logo2/1.png')} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 66,
    marginBottom: 12,
  },
});

export default memo(Logo);
