import { isNativeApp } from "./capacitorNative";

export async function hapticLight() {
  if (!isNativeApp()) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    /* optional */
  }
}
