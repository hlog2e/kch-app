import {
  getCrashlytics,
  setUserId as crashSetUserId,
  setAttribute as crashSetAttribute,
  recordError as crashRecordError,
  log as crashLog,
} from "@react-native-firebase/crashlytics";
import {
  getAnalytics,
  setAnalyticsCollectionEnabled,
  setUserId as analyticsSetUserId,
  setUserProperty,
  logEvent as analyticsLogEvent,
  logLogin as analyticsLogLogin,
  logSignUp as analyticsLogSignUp,
} from "@react-native-firebase/analytics";
const crash = getCrashlytics();
const anal = getAnalytics();

if (!__DEV__) {
  setAnalyticsCollectionEnabled(anal, true);
}

// ─── Crashlytics ───
export function setCrashlyticsUser(userId: string): void {
  crashSetUserId(crash, userId);
}

export function setCrashlyticsAttribute(key: string, value: string): void {
  crashSetAttribute(crash, key, value);
}

export function recordError(error: Error, context?: string): void {
  if (context) crashLog(crash, context);
  crashRecordError(crash, error);
}

export function crashlyticsLog(message: string): void {
  crashLog(crash, message);
}

// ─── Analytics ───
export async function setAnalyticsUser(
  userId: string | null
): Promise<void> {
  await analyticsSetUserId(anal, userId);
}

export async function setAnalyticsUserProperty(
  name: string,
  value: string | null
): Promise<void> {
  await setUserProperty(anal, name, value);
}

export async function logScreenView(screenName: string): Promise<void> {
  await analyticsLogEvent(anal, "screen_view", {
    screen_name: screenName,
    screen_class: screenName,
  });
}

export async function logEvent(
  name: string,
  params?: Record<string, any>
): Promise<void> {
  await analyticsLogEvent(anal, name, params);
}

export async function logLogin(method: string): Promise<void> {
  await analyticsLogLogin(anal, { method });
}

export async function logSignUp(method: string): Promise<void> {
  await analyticsLogSignUp(anal, { method });
}
