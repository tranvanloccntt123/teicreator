import { ScaledSheet } from "react-native-size-matters";

/*
  Breakpoint prefix	Minimum width	CSS
  sm	640px	@media (min-width: 640px) { ... }
  md	768px	@media (min-width: 768px) { ... }
  lg	1024px	@media (min-width: 1024px) { ... }
  xl	1280px	@media (min-width: 1280px) { ... }
  2xl	1536px	@media (min-width: 1536px) { ... }
*/

const AppStyles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loadingBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  fabButton: {
    width: "24@s",
    height: "24@s",
    position: "absolute",
    bottom: "15@s",
    right: "15@s",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppStyles;
