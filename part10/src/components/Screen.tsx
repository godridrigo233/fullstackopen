import { PropsWithChildren } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';

import AppBar from './AppBar';
import { colors } from '../theme';

const Screen = ({ children }: PropsWithChildren) => (
  <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safeArea}>
    <AppBar />
    <View style={styles.content}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default Screen;
