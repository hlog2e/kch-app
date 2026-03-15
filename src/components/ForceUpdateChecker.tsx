import { useEffect } from "react";
import * as Updates from "expo-updates";
import { useAlert } from "../../context/AlertContext";
import { recordError, crashlyticsLog } from "../../utils/firebase";

export default function ForceUpdateChecker() {
  const alert = useAlert();

  useEffect(() => {
    if (__DEV__) return;

    (async () => {
      try {
        const result = await Updates.checkForUpdateAsync();
        if (!result.isAvailable) return;

        const manifest = result.manifest as any;
        const isForce =
          manifest?.extra?.expoClient?.extra?.forceUpdate === "true";
        if (!isForce) return;

        crashlyticsLog("Force update detected, applying...");
        alert.loading("앱을 업데이트 하고있어요!");

        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } catch (error) {
        alert.close();
        recordError(
          error instanceof Error ? error : new Error(String(error)),
          "ForceUpdateChecker",
        );
      }
    })();
  }, []);

  return null;
}
