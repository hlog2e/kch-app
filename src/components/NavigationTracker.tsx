import { useEffect } from "react";
import { usePathname } from "expo-router";
import { logScreenView, crashlyticsLog } from "../../utils/firebase";

export default function NavigationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const screenName = pathname === "/" ? "home" : pathname;
    logScreenView(screenName);
    crashlyticsLog(`Screen: ${screenName}`);
  }, [pathname]);

  return null;
}
