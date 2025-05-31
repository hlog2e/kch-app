import moment from "moment";

interface CoordinateResult {
  lat: number;
  lng: number;
  x: number;
  y: number;
}

export function dfs_xy_conv(
  code: "toXY" | "toLL",
  v1: number,
  v2: number
): CoordinateResult {
  // LCC DFS 좌표변환을 위한 기초 자료
  //
  // (사용 예)
  // var rs = dfs_xy_conv("toLL","60","127");
  // console.log(rs.lat, rs.lng);
  //
  var RE = 6371.00877; // 지구 반경(km)
  var GRID = 5.0; // 격자 간격(km)
  var SLAT1 = 30.0; // 투영 위도1(degree)
  var SLAT2 = 60.0; // 투영 위도2(degree)
  var OLON = 126.0; // 기준점 경도(degree)
  var OLAT = 38.0; // 기준점 위도(degree)
  var XO = 43; // 기준점 X좌표(GRID)
  var YO = 136; // 기1준점 Y좌표(GRID)
  //
  // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
  //

  var DEGRAD = Math.PI / 180.0;
  var RADDEG = 180.0 / Math.PI;

  var re = RE / GRID;
  var slat1 = SLAT1 * DEGRAD;
  var slat2 = SLAT2 * DEGRAD;
  var olon = OLON * DEGRAD;
  var olat = OLAT * DEGRAD;

  var sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  var rs: CoordinateResult = {} as CoordinateResult;
  if (code == "toXY") {
    rs.lat = v1;
    rs.lng = v2;
    var ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    var theta = v2 * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;
    rs.x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs.y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
  } else {
    rs.x = v1;
    rs.y = v2;
    var xn = v1 - XO;
    var yn = ro - v2 + YO;
    var ra = Math.sqrt(xn * xn + yn * yn);
    if (sn < 0.0) -ra;
    var alat = Math.pow((re * sf) / ra, 1.0 / sn);
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

    var theta: number;
    if (Math.abs(xn) <= 0.0) {
      theta = 0.0;
    } else {
      if (Math.abs(yn) <= 0.0) {
        theta = Math.PI * 0.5;
        if (xn < 0.0) -theta;
      } else theta = Math.atan2(xn, yn);
    }
    var alon = theta / sn + olon;
    rs.lat = alat * RADDEG;
    rs.lng = alon * RADDEG;
  }
  return rs;
}

interface BaseTimeResult {
  baseTime: string;
  baseDate: string;
}

export function getBaseTime(): BaseTimeResult {
  const nowTime = moment().format("HHmm");

  let baseDate = moment().format("YYYYMMDD");
  let baseTime: string;
  // 기상청 정보는 1일 총 8번 업데이트 된다.(0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300)

  // 1200 <= currentTime < 0210 : 1200은 포함되고 (true) 0210은 포함되지 않음(flase)

  if (moment(nowTime).isBetween("1200", "0211")) {
    // 0시~2시 10분 사이 : base_date가 어제 날짜로 바뀌어야 한다.
    baseDate = moment(nowTime).subtract(1, "days").format("YYYYMMDD");
    baseTime = "2300";
  } else if (moment(nowTime).isBetween("0211", "0511")) {
    // 2시 11분~5시 10분 사이
    baseTime = "0200";
  } else if (moment(nowTime).isBetween("0511", "0811")) {
    // 5시 11분~8시 10분 사이
    baseTime = "0500";
  } else if (moment(nowTime).isBetween("0811", "1111")) {
    // 8시 11분~11시 10분 사이
    baseTime = "0800";
  } else if (moment(nowTime).isBetween("1111", "1411")) {
    // 11시 11분~14시 10분 사이
    baseTime = "1100";
  } else if (moment(nowTime).isBetween("1411", "1711")) {
    // 14시 11분~17시 10분 사이
    baseTime = "1400";
  } else if (moment(nowTime).isBetween("1711", "2011")) {
    // 17시 11분~20시 10분 사이
    baseTime = "1700";
  } else if (moment(nowTime).isBetween("2011", "2311")) {
    // 20시 11분~23시 10분 사이
    baseTime = "2000";
  } else {
    // 23시 11분~23시 59분
    baseTime = "2300";
  }

  return { baseTime, baseDate };
}
