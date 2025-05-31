import "intl";
import "intl/locale-data/jsonp/ko";

export const comma = (_num) => {
  return new Intl.NumberFormat("ko").format(_num);
};
