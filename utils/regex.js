export const lowEngAndNumRegexChecker = (_value) => {
  const engAndNumRegex = /^[a-z0-9]*$/; //소문자 영어랑 숫자만 허용
  return engAndNumRegex.test(_value);
};
export const engAndNumRegexChecker = (_value) => {
  const engAndNumRegex = /^[a-zA-Z0-9]*$/; //영어랑 숫자만 허용
  return engAndNumRegex.test(_value);
};
export const korAndEngRegexChecker = (_value) => {
  const korAndEngRegex =
    /^[a-z|A-Z|ㄱ-ㅎㅏ-ㅣ가-힣ᆢ|\u318D\u119E\u11A2\u2022\u2025a\u00B7\uFE55|\u1100-\u1112|]*$/;
  return korAndEngRegex.test(_value);
};
export const numRegexChecker = (_value) => {
  const numRegex = /^[0-9]*$/;
  return numRegex.test(_value);
};
export const numAndHyphenRegexChecker = (_value) => {
  const numRegex = /^[0-9|-]*$/;
  return numRegex.test(_value);
};
