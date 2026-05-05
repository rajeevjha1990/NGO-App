import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.svj.ngoapp',
  appName: 'SVJ',
  webDir: 'www',
  // Ye server section add karna sabse zaroori hai
  server: {
    androidScheme: 'https',
    hostname: 'app.sabkavikasjayti.org',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#ffffffff',
    },
  },
};

export default config;
