import { ScaledSheet } from "react-native-size-matters";

const AppStyles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  loadingBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  fabButton: {
    width: '24@s',
    height: '24@s',
    position: 'absolute',
    bottom: '15@s',
    right: '15@s',
  }
});

export default AppStyles;
