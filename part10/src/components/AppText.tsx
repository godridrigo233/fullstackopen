import { Text as NativeText, TextProps, Platform } from 'react-native';

type AppTextProps = TextProps & {
  bold?: boolean;
};

export const fontFamily = (bold = false) =>
  Platform.select({
    android: bold ? 'Ubuntu_700Bold' : 'Ubuntu_400Regular',
    ios: 'Arial',
    default: 'System',
  });

const AppText = ({ bold = false, style, ...props }: AppTextProps) => (
  <NativeText
    {...props}
    style={[
      {
        color: '#17211f',
        fontFamily: fontFamily(bold),
        fontWeight: bold ? '700' : '400',
      },
      style,
    ]}
  />
);

export default AppText;
