// metro.config.js
const { getDefaultConfig } = require("expo/metro-config"); // 또는 '@react-native/metro-config'
const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver = defaultConfig.resolver || {};
defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "axios" || moduleName.startsWith("axios/")) {
    // Expo SDK 50 이상에서는 'browser' 조건이 기본적으로 잘 처리될 수 있으나,
    // 명시적으로 지정하여 문제를 해결하려는 시도입니다.
    // 또는 context. condizioniNames에 'browser'를 추가하는 것을 시도해 볼 수 있습니다.
    // https://facebook.github.io/metro/docs/configuration/#resolverequest
    // 최신 Expo/Metro에서는 아래 방식보다 package.json의 "browser" 필드를
    // Metro가 잘 해석하도록 하는 것이 더 일반적일 수 있습니다.
    // 하지만 이슈에서 제안된 방식은 다음과 같습니다.
    return context.resolveRequest(
      {
        ...context,
        unstable_conditionNames: ["browser", "require", "react-native"], // 'browser' 우선
      },
      moduleName,
      platform
    );
  }
  // 다른 모든 모듈에 대해서는 기본 리졸버를 사용합니다.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = defaultConfig;
