import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.bookworm.desktop',
  appName: 'Bookworm Library Manager',
  webDir: 'dist',
  bundledWebRuntime: false,
  electron: {
    hiddenInsets: true,
    nativeMenu: true
  }
};

export default config;
