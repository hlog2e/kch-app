import axios from "axios";

export default async function badWordChecker(_sentense) {
  const { data } = await axios.get(
    "https://cdn.jsdelivr.net/gh/hlog2e/bad_word_list@master/word_list.json"
  );

  const word_list = data.words;

  //숫자,특수문자, 괄호, 점, 공백 모두 제거
  const reg = /[`0-9~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/gim;
  const pure_sentence = _sentense.replace(reg, "");

  let isBad = false;
  let badWord = "";

  for (let i = 0; i < word_list.length; i++) {
    const isInclude = pure_sentence.includes(word_list[i]);
    if (isInclude) {
      isBad = true;
      badWord = word_list[i];
      break;
    }
  }

  return { isBad: isBad, word: badWord };
}
