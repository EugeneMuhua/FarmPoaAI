import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.farmpoa.ai',
  appName: 'FarmPoa AI',
  webDir: 'dist',
  plugins: {
    Camera: {
      permissions: ['camera']
    }
  }
};

export default config;