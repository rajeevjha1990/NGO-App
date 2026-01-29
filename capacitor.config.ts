import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "SVJ",
  webDir: "www",
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // Show for 3 seconds
      launchAutoHide: true, // Automatically hide
      backgroundColor: "#ffffffff",
    },
  },
};

export default config;
