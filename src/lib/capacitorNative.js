import { Capacitor } from "@capacitor/core";

export function isNativeApp() {
  return Capacitor.isNativePlatform();
}

export function getNativePlatform() {
  return Capacitor.getPlatform();
}

export async function initCapacitorNative() {
  if (!isNativeApp()) return;

  document.documentElement.classList.add("native-app");

  try {
    const [{ StatusBar, Style }, { SplashScreen }] = await Promise.all([
      import("@capacitor/status-bar"),
      import("@capacitor/splash-screen"),
    ]);

    if (Capacitor.getPlatform() === "android") {
      await StatusBar.setBackgroundColor({ color: "#FFFFFF" });
      await StatusBar.setStyle({ style: Style.Dark });
    } else if (Capacitor.getPlatform() === "ios") {
      await StatusBar.setStyle({ style: Style.Dark });
    }

    await SplashScreen.hide({ fadeOutDuration: 300 });
  } catch {
    /* plugins optional in browser */
  }
}
