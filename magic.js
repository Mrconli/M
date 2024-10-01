//Wed Jul 03 2024 17:44:44 GMT+0000 (Coordinated Universal Time)
//Base:https://github.com/echo094/decode-js
//Modify:https://github.com/smallfawn/decode_action
let mode = __dirname.includes("Work"),
  testMode = process.env.M_TEST_MODE?.["includes"]("on") ? true : mode,
  wxProxyEnable = parseInt(process.env.M_WX_PROXY_ENABLE || "2"),
  reRouterEnable = parseInt(process.env.M_RE_ROUTER_ENABLE || "2"),
  reRouterMsg = process.env.M_RE_ROUTER_MSG || "重拨",
  openCardMode = process.env.M_OPEN_CARD_MODE || "wh5",
  proxyRegx = process.env.M_WX_PROXY_ENABLE_REGEXP ? process.env.M_WX_PROXY_ENABLE_REGEXP : "(Request failed with status code 504)|(Request failed with status code 403)|disconnected|(Request failed with status code 493)|certificate|timeout|ECONNREFUSED|ETIMEDOUT|(tunneling socket could not be established)",
  reTryRegx = "(哎呀活动火爆，请稍后再试|活动太火爆了|服务器数据忙|奖品与您擦肩而过了哟)",
  tokenCacheMin = parseInt(process.env?.["M_WX_TOKEN_CACHE_MIN"] || 5),
  tokenCacheMax = parseInt(process.env?.["M_WX_TOKEN_CACHE_MAX"] || 10),
  enableCacheToken = parseInt(process.env?.["M_WX_ENABLE_CACHE_TOKEN"] || 1),
  isvObfuscatorRetry = parseInt(process.env?.["M_WX_ISVOBFUSCATOR_RETRY"] || 2),
  isvObfuscatorRetryWait = parseInt(process.env?.["M_WX_ISVOBFUSCATOR_RETRY_WAIT"] || 2),
  signMode = process.env.M_SIGN_MODE ? process.env.M_SIGN_MODE : "local",
  apiToken = process.env.M_API_TOKEN ? process.env.M_API_TOKEN : "",
  apiSignUrl = process.env.M_API_SIGN_URL ? process.env.M_API_SIGN_URL : "http://api.nolanstore.cc/sign",
  wskeyFile = process.env.M_WSKEY_FILE ? process.env.M_WSKEY_FILE : mode ? "/home/magic/Work/wools/doc/config.sh" : "",
  blackPinConfig = {
    "cjhy-isv.isvjcloud.com": process.env.M_WX_CJ_BLACK_COOKIE_PIN ? process.env.M_WX_CJ_BLACK_COOKIE_PIN : "",
    "cjhydz-isv.isvjcloud.com": process.env.M_WX_CJ_BLACK_COOKIE_PIN ? process.env.M_WX_CJ_BLACK_COOKIE_PIN : "",
    "lzkj-isv.isvjcloud.com": process.env.M_WX_LZ_BLACK_COOKIE_PIN ? process.env.M_WX_LZ_BLACK_COOKIE_PIN : "",
    "lzkjdz-isv.isvjcloud.com": process.env.M_WX_LZ_BLACK_COOKIE_PIN ? process.env.M_WX_LZ_BLACK_COOKIE_PIN : "",
    "*": process.env.M_WX_BLACK_COOKIE_PIN ? process.env.M_WX_BLACK_COOKIE_PIN : ""
  },
  stopKeywords = ["来晚了", "已发完", "参数缺失或无效", "超出活动计划时间", "奖品发送失败", "发放完", "全部被领取", "余额不足", "已结束", "活动已经结束", "未开始"];
process.env.M_WX_STOP_KEYWORD ? process.env.M_WX_STOP_KEYWORD.split(/[@,&|]/).forEach(l1iIilii => stopKeywords.push(l1iIilii)) : "";
let M_WX_ADDRESS_MODE = process.env?.["M_WX_ADDRESS_MODE"] || "RANDOM",
  M_WX_ADDRESS_RANGE = process.env?.["M_WX_ADDRESS_RANGE"] || "1-9999",
  M_WX_ADDRESS_MODE_LOWER = parseInt(process.env?.["M_WX_ADDRESS_MODE_LOWER"] || 0),
  M_WX_ADDRESS_LOG = parseInt(process.env?.["M_WX_ADDRESS_LOG"] || 0),
  addressStopKeywords = ["京豆", "红包", "券", "再来一次", "客服"],
  addressStopKeywordsRule = ["下单满", "签收后", "收到货后", "成功购买任意", "必须购买店铺内"];
process.env.M_WX_ADDRESS_STOP_KEYWORD ? process.env.M_WX_ADDRESS_STOP_KEYWORD.split(/[@,&|]/).forEach(I1I1iil1 => addressStopKeywords.push(I1I1iil1)) : "";
process.env.M_WX_ADDRESS_STOP_KEYWORD_RULE ? process.env.M_WX_ADDRESS_STOP_KEYWORD_RULE.split(/[@,&|]/).forEach(i1I1IIII => addressStopKeywordsRule.push(i1I1IIII)) : "";
let wxWhitelist = [];
process.env.M_WX_WHITELIST ? process.env.M_WX_WHITELIST.split(/[@,&|]/).forEach(li1l1lli => wxWhitelist.push(li1l1lli.includes("-") ? li1l1lli : li1l1lli * 1)) : [];
let wxWhitelistNotSupportFile = ["Invite", "invite", "collectCard", "unPackDraw", "team", "microDz", "share", "opencard"];
process.env.M_WX_WHITELIST_NOT_SUPPORT_FILE ? process.env.M_WX_WHITELIST_NOT_SUPPORT_FILE.split(/[@,&|]/).forEach(l1il111I => wxWhitelistNotSupportFile.push(l1il111I)) : "";
let blockPinRegx = process.env.M_WX_BLOCK_PIN_REGX || "",
  openCardTypes = ["10033", "10043", "10052", "10068"];
process.env.M_WX_OPEN_CARD_TYPES ? process.env.M_WX_OPEN_CARD_TYPES.split(/[@,&|]/).forEach(li1Iilil => openCardTypes.push(li1Iilil)) : "";
let masterNum = parseInt(process.env.M_WX_LEADER_NUM || "9999");
const notInitPinTokenRegex = /(lorealjdcampaign-rc.isvjcloud.com|interaction\/v1)/,
  urlPrefixes = {
    "/prod/cc/interactsaas": /interactsaas/,
    "/crm-proya/apps/interact": /crm-proya/,
    "/apps/interact": /lorealjdcampaign-rc.isvjcloud.com\/prod\/cc/,
    "prod/cc/cjwx": /lorealjdcampaign-rc.isvjcloud.com\/prod\/cc\/cjwx/,
    "/apps/interact": /lorealjdcampaign-rc.isvjcloud.com\/interact/,
    "/prod/cc/interaction/v1": /interaction/
  };
let hdbTypes = ["hdb-isv.isvjcloud.com", "jingyun-rc.isvjcloud.com"],
  jinggengTypes = ["jinggeng-isv.isvjcloud.com"],
  jinggengcjTypes = ["jinggengjcq-isv.isvjcloud.com", "mpdz-act-dz.isvjcloud.com"],
  keywords = ["pps", "utm_campaign", "utm_term", "utm_source", "utm_medium", "teamId", "mpin", "shareUuid", "signUuid", "inviterNick", "inviter", "InviteUuid", "inviterNickName", "sharer", "inviterImg", "nickName", "nick", "friendUuid", "helpUuid", "shareuserid4minipg", "bizExtString", "invitePin", "pps", "cookie", "friendid", "bizExtString", "bizExtString", "koikey", "pps", "inviter_id", "invitePin", "portrait", "sid", "shareUserId", "_ts", "pps", "pps", "pps", "DEBUG", "shareOpenId", "jxsid", "ad_od", "token", "pps", "encryptOpenId", "gx", "gxd", "accessToken"],
  _currentTime = Date.now(),
  proxies = [];
for (let i = 0; i < 20; i++) {
  try {
    if (!process.env["M_WX_PROXY_URL" + (i || "")]) continue;
    proxies.push({
      "index": i + 1,
      "url": process.env["M_WX_PROXY_URL" + (i || "")],
      "close": process.env["M_WX_PROXY_CLOSE" + (i || "")] || "",
      "type": parseInt(process.env["M_WX_PROXY_TYPE" + (i || "")] || 1)
    });
  } catch (iilllliI) {
    console.log("读取代理配置 出错", iilllliI);
  }
}
const version = "v3.7.0",
  axios = require("axios"),
  fs = require("fs"),
  tunnel = require("tunnel"),
  {
    format
  } = require("date-fns"),
  cheerio = require("cheerio"),
  notify = require("./sendNotify");
let jdCookieNode = require("./jdCookie.js");
const CryptoJS = require("crypto-js");
let base64 = require("base-64");
try {
  base64 = require("base-64");
} catch (iI1l1il) {
  console.log("请安装base-64依赖");
}
let NodeRSA;
try {
  NodeRSA = require("node-rsa");
} catch (l1lliIiI) {
  console.log("请安装node-rsa依赖");
}
const h5sts = require("./h5sts.js");
let cookies = [];
Object.keys(jdCookieNode).length > 0 && Object.keys(jdCookieNode).forEach(l1li1lli => {
  cookies.push(jdCookieNode[l1li1lli]);
});
const JDAPP_USER_AGENTS = ["jdapp;android;10.0.2;9;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 9; MHA-AL00 Build/HUAWEIMHA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36", "jdapp;android;10.0.2;9;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 9; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36", "jdapp;android;10.0.2;9;" + uuid() + ";network/4g;Mozilla/5.0 (Linux; Android 9; Mi Note 3 Build/PKQ1.181007.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36", "jdapp;android;10.0.2;9;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 9; 16T Build/PKQ1.190616.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36", "jdapp;android;10.0.2;10;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 10; ONEPLUS A5010 Build/QKQ1.191014.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36", "jdapp;android;10.0.2;10;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36", "jdapp;android;10.0.2;10;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 10; ONEPLUS A6000 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045224 Mobile Safari/537.36", "jdapp;android;10.0.2;10;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36", "jdapp;android;10.0.2;10;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 10; LYA-AL00 Build/HUAWEILYA-AL00L; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36", "jdapp;android;10.0.2;10;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 10; Redmi K20 Pro Premium Edition Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36", "jdapp;android;10.0.2;11;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 11; Redmi K20 Pro Premium Edition Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045513 Mobile Safari/537.36", "jdapp;android;10.0.2;10;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045227 Mobile Safari/537.36", "jdapp;android;10.0.2;11;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 11; Redmi K30 5G Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045511 Mobile Safari/537.36", "jdapp;iPhone;10.0.2;14.2;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;14.3;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;14.2;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;11.4;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79", "jdapp;android;10.0.2;10;;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 10; M2006J10C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36", "jdapp;iPhone;10.0.2;14.3;" + uuid() + ";network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;13.6;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;13.6;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;13.5;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;14.1;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;13.3;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;13.7;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;14.1;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;13.3;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;13.4;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;14.3;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;14.3;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;14.3;" + uuid() + ";network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;iPhone;10.0.2;14.1;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;android;10.0.2;8.1.0;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 8.1.0; 16 X Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36", "jdapp;android;10.0.2;8.0.0;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 8.0.0; HTC U-3w Build/OPR6.170623.013; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36", "jdapp;iPhone;10.0.2;14.0.1;" + uuid() + ";network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1", "jdapp;android;10.0.2;8.1.0;" + uuid() + ";network/wifi;Mozilla/5.0 (Linux; Android 8.1.0; MI 8 Build/OPM1.171019.026; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/045131 Mobile Safari/537.36"],
  $ = axios.create({
    "timeout": 20000
  });
$.defaults.headers.Accept = "*/*";
$.defaults.headers.Connection = "keep-alive";
$.defaults.headers["Accept-Language"] = "zh-CN,zh-Hans;q=0.9";
$.defaults.headers["Accept-Encoding"] = "gzip, deflate, br";
$.defaults.retry = 2;
$.defaults.retryDelay = 2000;
let resetRouterTimeInterval = process.env.M_WX_RESET_ROUTER_TIME_INTERVAL ? process.env.M_WX_RESET_ROUTER_TIME_INTERVAL * 1 : 60,
  status493 = false;
$.defaults.shouldRetry = async iII1i1l => {
  let llliiIl1 = iII1i1l.response?.["status"];
  if ([403, 407].includes(llliiIl1)) return false;
  if (llliiIl1 === 493) {
    return status493 = true, true;
  }
  if (iII1i1l.message.includes("timeout") || iII1i1l.message.includes("TLS") || iII1i1l.message.includes("ECONNRESET")) {
    return true;
  }
  if (iII1i1l.message.includes("tunneling socket could not be established")) return needRouter = true, false;
  return true;
};
$.interceptors.request.use(function (l1iilil) {
  if (l1iilil.url.includes("QueryShopMemberInfoJson") || l1iilil.url.includes("isvObfuscator") || l1iilil.url.includes("getMyPing") || l1iilil.url.includes("getTopAndNewActInfo") || l1iilil.url.includes("initForFarm") || l1iilil.url.includes("scan") || l1iilil.url.includes("getShopHomeBaseInfo") || l1iilil.url.includes("getShopOpenCardInfo") || l1iilil.url.includes("initPetTown") || l1iilil.url.includes("getFansFuseMemberDetail") || l1iilil.url.includes("0/sign") || l1iilil.url.includes("2/sign") || l1iilil.url.includes("9/sign") || l1iilil.url.includes("/h5stv3") || l1iilil.url.includes("/sendMessage") || l1iilil.url.includes("getShopHomeActivityInfo") || l1iilil.url.includes("getShopHomeFloorInfo") || l1iilil.url.includes("rmvCmdy") || l1iilil.url.includes("uncheckcmdy")) return l1iilil;
  return l1iilil;
}, function (lIi1lI1) {
  return Promise.reject(lIi1lI1);
});
$.interceptors.response.use(function (ii1ilIi1) {
  if (ii1ilIi1.config.url.includes("QueryShopMemberInfoJson") || ii1ilIi1.config.url.includes("isvObfuscator") || ii1ilIi1.config.url.includes("activityContent") || ii1ilIi1.config.url.includes("initForFarm") || ii1ilIi1.config.url.includes("scan") || ii1ilIi1.config.url.includes("getShopHomeBaseInfo") || ii1ilIi1.config.url.includes("getShopOpenCardInfo") || ii1ilIi1.config.url.includes("initPetTown") || ii1ilIi1.config.url.includes("getFansFuseMemberDetail") || ii1ilIi1.config.url.includes("0/sign") || ii1ilIi1.config.url.includes("2/sign") || ii1ilIi1.config.url.includes("memberBringActPage") || ii1ilIi1.config.url.includes("9/sign") || ii1ilIi1.config.url.includes("/h5stv3") || ii1ilIi1.config.url.includes("/getMyPing") || ii1ilIi1.config.url.includes("/getSimpleActInfoVo") || ii1ilIi1.config.url.includes("getShopHomeActivityInfo") || ii1ilIi1.config.url.includes("getShopHomeFloorInfo") || ii1ilIi1.config.url.includes("whx_getMShopOutlineInfo") || ii1ilIi1.config.url.includes("rmvCmdy") || ii1ilIi1.config.url.includes("/sendMessage") || ii1ilIi1.config.url.includes("/getGameInfo") || ii1ilIi1.config.url.includes("/login") || ii1ilIi1.config.url.includes("/checkOpenCard") || ii1ilIi1.config.url.includes("/jiugongge/activity") || ii1ilIi1.config.url.includes("/taskInfo") || ii1ilIi1.config.url.includes("/organizeTeam/activity") || ii1ilIi1.config.url.includes("/basicInfo") || ii1ilIi1.config.url.includes("uncheckcmdy")) return status493 = ii1ilIi1.status === 493, ii1ilIi1;
  return status493 = ii1ilIi1.status === 493, ii1ilIi1;
}, function (iIII111I) {
  let iIlIiilI = iIII111I.config;
  if (!iIlIiilI || !iIlIiilI.retry) return Promise.reject(iIII111I);
  if (!iIlIiilI.shouldRetry || typeof iIlIiilI.shouldRetry != "function") return Promise.reject(iIII111I);
  if (!iIlIiilI.shouldRetry(iIII111I)) {
    return Promise.reject(iIII111I);
  }
  iIlIiilI.__retryCount = iIlIiilI.__retryCount || 0;
  if (iIlIiilI.__retryCount >= iIlIiilI.retry) return Promise.reject(iIII111I);
  iIlIiilI.__retryCount += 1;
  let iiI1l111 = new Promise(function (iilIl1lI) {
    setTimeout(function () {
      iilIl1lI();
    }, iIlIiilI.retryDelay || 1);
  });
  return iiI1l111.then(function () {
    return axios(iIlIiilI);
  });
});
function uuid(iiIili1l = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
  return iiIili1l.replace(/[xy]/g, function (IlilI1iI) {
    const IIII1lIi = 16 * Math.random() | 0,
      l1lI1iI = "x" === IlilI1iI ? IIII1lIi : 3 & IIII1lIi | 8;
    return l1lI1iI.toString(36);
  });
}
class Env {
  constructor(iiiIiIii) {
    this.name = iiiIiIii;
    this.username = "";
    this.cookie = "";
    this.wskey = "";
    this.wskeys = new Map();
    this.originCookies = cookies;
    this.cookies = cookies;
    this.index = "";
    this.ext = [];
    this.msg = [];
    this.delimiter = "";
    this.filename = "";
    this.ticket = "";
    this.appId = "";
    this.algo = {};
    this.bot = false;
    this.openCount = 0;
    this.expire = false;
    this.breakBefore = false;
    this.skipNum = 0;
    this.accounts = {};
    this.accountAddressList = [];
    this.domain = "";
    this.activityUrl = "";
    this.activityId = "";
    this.activityType = "";
    this.tickets = new Map();
    this.addressIndex = 1;
    this.shopName = "";
    this.needOpenCard = false;
    this.urlPrefix = "";
    this.proxyEnable = false;
    this.superVersion = version;
    this.version = "";
    this.shopName = "";
    this.venderId = "";
    this.shopId = "";
    this.ownerUuid = "";
    this.exit = true;
    this.rule = "";
    this.masterNum = masterNum;
    this.prizeList = [];
    this.hdbTypes = hdbTypes;
    this.jinggengcjTypes = jinggengcjTypes;
    this.jinggengTypes = jinggengTypes;
    this.defenseUrls = [];
    this.runAll = false;
    this.currAddrUsername = "";
  }
  async ["run"](iiIIilii = {
    "wait": [1000, 2000],
    "bot": false,
    "delimiter": "",
    "o2o": false,
    "random": false,
    "once": false,
    "wskey": false,
    "mod": 1,
    "multCenter": false,
    "blacklist": [],
    "whitelist": []
  }) {
    try {
      Promise.resolve().then(() => this.forceQuit());
      this.filename = process.argv[1];
      console.log(this.now() + " " + this.name + " " + this.filename + " 开始运行...");
      console.log("MK集团本部TG频道:https://t.me/Bigyellowtl");
      //console.log("当前token:\"" + this.desensitizeString(apiToken) + "\"");
      //console.log("sign地址:" + this.desensitizeString(apiSignUrl));
      //if (this.activityUrl && !this.version) throw new Error("请更新代码");
      //console.log("当前版本:" + (this.version || "v1.0.0") + ",依赖版本:" + (this.superVersion || "v1.0.0"));
      if (process.env.M_SYS_INFO === "1") {
        console.log("-----------------系统参数-----------------");
        for (let IlllIlll in process.env) {
          if (!IlllIlll.startsWith("M_") || IlllIlll.includes("URL") || IlllIlll.includes("TOKEN") || IlllIlll.includes("ARGV")) {
            continue;
          }
          console.log(IlllIlll + "=\"" + process.env[IlllIlll] + "\"");
        }
        console.log("-----------------系统参数-----------------");
      }
      this.__start = this.timestamp();
      let ii1lil1I = "";
      try {
        if (mode) {
          ii1lil1I = this.readFileSync("/home/magic/Work/wools/doc/account.json");
        } else {
          if (fs.existsSync("utils/account.json")) {
            ii1lil1I = this.readFileSync("utils/account.json");
          } else fs.existsSync("/jd/config/account.json") ? ii1lil1I = this.readFileSync("/jd/config/account.json") : ii1lil1I = this.readFileSync("account.json");
        }
        if (ii1lil1I) {
          JSON.parse(ii1lil1I).forEach(lli1lIl1 => {
            this.accounts[lli1lIl1.pt_pin] = lli1lIl1;
            lli1lIl1?.["address"] && this.accountAddressList.push(lli1lIl1?.["address"]);
          });
        }
      } catch (IIii1iIi) {
        console.log("account.json读取异常", IIii1iIi);
        this.msg.push("account.json读取异常");
      }
      await this.config();
      iiIIilii?.["delimiter"] && (this.delimiter = iiIIilii?.["delimiter"]);
      iiIIilii?.["bot"] && (this.bot = iiIIilii.bot);
      console.log("原始ck长度", cookies.length);
      if (iiIIilii?.["blacklist"]?.["length"] > 0) for (const ll1Iii11 of this.__as(iiIIilii.blacklist)) {
        delete cookies[ll1Iii11 - 1];
      }
      this.buildActInfo();
      console.log("排除黑名单后ck长度", cookies.length);
      wxWhitelist.length > 0 && wxWhitelistNotSupportFile.filter(Iiill1ll => this.filename.includes(Iiill1ll)).length === 0 && this.filename.includes("_wx_") && (console.log("支持全局无线ck长度:" + wxWhitelist), console.log("支持全局无线ck长度:" + wxWhitelistNotSupportFile), iiIIilii.whitelist = wxWhitelist);
      if (iiIIilii?.["whitelist"]?.["length"] > 0) {
        let ii111111 = [];
        for (const lliiI1li of this.__as(iiIIilii.whitelist)) {
          lliiI1li - 1 < cookies.length && ii111111.push(cookies[lliiI1li - 1]);
        }
        cookies = ii111111;
      }
      console.log("设置白名单后ck长度", cookies.length);
      this.delBlackCK();
      console.log("排除PIN黑名单后ck长度", cookies.length);
      if (fs.existsSync("./ck")) {
        for (let IIl1IllI of fs.readdirSync("./ck")) {
          if (IIl1IllI.includes(".txt")) {
            let lli1i1Il = fs.readFileSync("./ck/" + IIl1IllI, "utf-8");
            lli1i1Il = lli1i1Il.replace(/\r/g, "");
            lli1i1Il = lli1i1Il.replace(/\n/g, "&");
            let llII1lIi = lli1i1Il.split("&");
            for (let I1lilIil = 0; I1lilIil < llII1lIi.length; I1lilIil++) {
              cookies.push(llII1lIi[I1lilIil]);
            }
            console.log("读取" + IIl1IllI + "后ck长度", cookies.length);
          }
        }
      }
      iiIIilii?.["random"] && (cookies = this.randomArray(cookies));
      if (iiIIilii?.["wskey"]) {
        try {
          let IIIl1l11 = fs.existsSync(wskeyFile) ? this.readFileSync(wskeyFile).split("\n") : process.env?.["JD_WSCK"]?.["split"]("&") || [];
          for (let iIIIi1il of IIIl1l11) {
            if (!iIIIi1il.endsWith(";")) {
              iIIIi1il += ";";
            }
            if (iIIIi1il.startsWith("pin")) this.wskeys.set(iIIIi1il.match(/pin=([^; ]+)(?=;?)/)[1], iIIIi1il.match(/(pin=.*?;wskey=.*?;)/)[1]);else iIIIi1il.startsWith("wskey") && this.wskeys.set(iIIIi1il.match(/pin=([^; ]+)(?=;?)/)[1], iIIIi1il.match(/(pin=.*?;wskey=.*?;)/)[1]);
          }
          console.log("当前wskey共计" + this.wskeys.size + "个");
        } catch (iii1IIIl) {
          console.log("wkeys读取异常", iii1IIIl);
          this.msg.push("wkeys读取异常");
        }
      }
      //await this.auth();
      await this.routerProxy();
      await this.verify();
      this.cookies = cookies;
      if (iiIIilii?.["before"]) for (let l111l1i = 0; l111l1i < this.cookies.length; l111l1i++) {
        if (!this.cookies[l111l1i]) continue;
        if (this.breakBefore) {
          break;
        }
        let iIll = this.cookies[l111l1i];
        this.cookie = iIll;
        let I1iilIi1 = iIll.match(/pt_pin=(.+?);/) && iIll.match(/pt_pin=(.+?);/)[1];
        this.username = decodeURIComponent(I1iilIi1);
        this.wskey = this.wskeys.get(I1iilIi1);
        $.defaults.headers.Cookie = this.cookie;
        this.index = l111l1i + 1;
        try {
          let II1Il1i = await this.before();
          if (II1Il1i) {
            this.ext.push(Object.assign({
              "username": this.username,
              "index": this.index,
              "cookie": this.cookie
            }, II1Il1i));
          }
        } catch (I1i11111) {
          console.log(I1i11111);
        }
        if (iiIIilii?.["wait"]?.["length"] > 0 && this.index !== cookies.length && !this.breakBefore) {
          await this.wait(iiIIilii?.["wait"][0], iiIIilii?.["wait"][1]);
        }
      }
      let i1iI1lil = false;
      IIIiill1: for (let iii1Iiii = 0; iii1Iiii < this.cookies.length; iii1Iiii++) {
        if (!this.cookies[iii1Iiii]) {
          continue;
        }
        if (this.expire) {
          break;
        }
        let i1Ill1i1 = this.cookies[iii1Iiii];
        this.cookie = i1Ill1i1;
        let IiI1iliI = i1Ill1i1.match(/pt_pin=(.+?);/) && i1Ill1i1.match(/pt_pin=(.+?);/)[1];
        this.username = decodeURIComponent(IiI1iliI);
        this.index = iii1Iiii + 1;
        if (iiIIilii?.["once"] && this.index !== iiIIilii.once) {
          i1iI1lil = true;
          continue;
        }
        if (this.skipNum > 0 && this.skipNum-- > 0) {
          this.log("跳过当前ck skipNum=" + this.skipNum);
          continue;
        }
        this.wskey = this.wskeys.get(IiI1iliI);
        $.defaults.headers.Cookie = this.cookie;
        !iiIIilii?.["before"] ? this.ext.push({
          "username": this.username,
          "index": this.index,
          "cookie": this.cookie
        }) : "";
        !(this.activityUrl.includes("prod/cc") || this.activityUrl.includes("interact") || this.activityUrl.includes("crm-proya")) && (this.index > 1 ? this.appId === "wx" ? await this._algo() : "" : "");
        status493 = false;
        for (let IlIi11li = 0; IlIi11li < 3; IlIi11li++) {
          try {
            await this.logic();
            iiIIilii?.["o2o"] && this.msg.length > 5 && (await this.send(), testMode ? this.log(this.msg.join("\n")) : "", this.msg = []);
            if (i1iI1lil) {
              break IIIiill1;
            }
            break;
          } catch (IiIlI1) {
            this.log("捕获异常", IiIlI1.message);
            try {
              if (this.isProxy(IiIlI1?.["message"])) {
                await this.routerProxy();
                continue;
              } else {
                if (IiIlI1?.["response"]?.["status"] === 493 || IiIlI1?.["message"]?.["includes"]("493")) {
                  await this.router();
                  continue;
                }
              }
              if (IiIlI1?.["response"]?.["status"] === 403) {
                this.msg.push("IP 403 403 403");
                continue;
              }
              if (status493) {
                this.msg.push("beta测试");
                continue;
              }
              break;
            } catch (lilIIIlI) {
              this.log(lilIIIlI);
            }
          }
        }
        if (iiIIilii?.["wait"]?.["length"] > 0 && this.index !== cookies.length && !this.expire) {
          await this.wait(iiIIilii?.["wait"][0], iiIIilii?.["wait"][1]);
        }
      }
      try {
        if (this.msg.length > 0) {
          this.msg.push("");
        }
        this.actName && this.msg.push("活动名称:" + this.actName);
        this.shopName && this.msg.push("#" + this.shopName);
        this.shopId && this.venderId && !this.shopName && this.msg.push("#" + (await this.getShopName()));
        this.shopId && this.venderId && this.msg.push("店铺信息:" + this.shopId + "_" + this.venderId);
        if (this.actStartTime || this.actEndTime) {
          this.actStartTime && !("" + this.actStartTime).includes("-") && (this.actStartTime = this.formatDate(this.actStartTime, "yyyy-MM-dd HH:mm:ss"));
          this.actEndTime && !("" + this.actEndTime).includes("-") && (this.actEndTime = this.formatDate(this.actEndTime, "yyyy-MM-dd HH:mm:ss"));
          this.msg.push("活动时间:" + (this.actStartTime || "") + "至" + (this.actEndTime || ""));
        }
        await this.after();
        (this.shopId || this.userId || this.venderId) && (this.msg.push(""), this.msg.push("https://shop.m.jd.com/shop/home?shopId=" + (this.shopId || this.userId || this.venderId || "")));
      } catch (lilliiII) {
        this.log("after error" + lilliiII.message);
      }
      console.log(this.now() + " " + this.name + " 运行结束,耗时 " + (this.timestamp() - this.__start) + "ms\n");
      testMode && this.msg.length > 0 ? console.log(this.msg.join("\n")) : "";
      !this.notSend && !iiIIilii?.["o2o"] && (await this.send());
    } finally {
      process.exit(0);
    }
  }
  async ["forceQuit"](IiIIli1l = 3) {
    if (process.env?.["M_TIMEOUT_QUIT"]) {
      while ((Date.now() - _currentTime) / 1000 / 60 < IiIIli1l) {
        console.log("进程监控中...");
        await this.wait(30 * 1000);
      }
      this.log("进程超时，强制退出");
      process.exit(0);
    }
  }
  async ["config"]() {}
  ["isProxy"](IIiI1lIi = "493") {
    if (wxProxyEnable === 1 && this.index === 1) {
      return;
    }
    return this.isNeedRouter(IIiI1lIi);
  }
  ["isNeedRouter"](li1llIIl) {
    const I1IiliI = new RegExp(proxyRegx);
    return I1IiliI.test(li1llIIl) && (this.domain.includes("isvjcloud") || this.proxyEnable);
  }
  ["delBlackCK"]() {
    let li1i1l1I = [];
    ii1l1iil: for (let llI111lI = 0; llI111lI < cookies.length; llI111lI++) {
      if (cookies[llI111lI]) {
        let lIlIi1Il = cookies[llI111lI],
          IliiliI = lIlIi1Il.match(/pt_pin=(.+?);/) && lIlIi1Il.match(/pt_pin=(.+?);/)[1];
        if (this.activityUrl.includes("isvjcloud") && blockPinRegx) {
          for (let IiIil1il of blockPinRegx.split(";")) {
            let llI11111 = IiIil1il.split("@"),
              IiIl1111 = this.activityUrl.match(new RegExp(llI11111[0]));
            if (IiIl1111 && llI11111[1].split("|").includes(IliiliI)) {
              this.log("匹配到黑名单 " + IiIil1il + " " + IliiliI);
              continue ii1l1iil;
            }
          }
        }
        if (blackPinConfig[this.domain]?.["includes"](IliiliI)) continue;
        if (blackPinConfig["*"]?.["includes"](IliiliI)) continue;
        li1i1l1I.push(lIlIi1Il);
      }
    }
    cookies = li1i1l1I;
  }
  ["me"]() {
    return this.ext[this.index - 1];
  }
  ["__as"](liliI1i1) {
    let iIiI1I1I = [];
    for (let IIiIi1iI of liliI1i1) {
      if (typeof IIiIi1iI !== "string") {
        iIiI1I1I.push(IIiIi1iI);
        continue;
      }
      for (let iliil1 of IIiIi1iI.split(",")) {
        if (typeof iliil1 === "string") {
          if (iliil1.includes("-")) {
            let lIiiIl1 = iliil1.split("-")[0] * 1,
              iIIiIill = iliil1.split("-")[1] * 1;
            if (iIIiIill - lIiiIl1 === 1) iIiI1I1I.push(lIiiIl1), iIiI1I1I.push(iIIiIill);else for (let li1II1i = lIiiIl1; li1II1i <= iIIiIill; li1II1i++) {
              iIiI1I1I.push(li1II1i);
            }
          } else {
            iIiI1I1I.push(iliil1 * 1);
          }
        } else {
          iIiI1I1I.push(iliil1);
        }
      }
    }
    return iIiI1I1I;
  }
  ["deleteCookie"]() {
    return delete this.cookies[this.index - 1], {};
  }
  ["groupBy"](l11Iii11, iliI11ii) {
    const ll1illIi = {};
    return l11Iii11.forEach(function (lIlIiIII) {
      const ilIl1lli = iliI11ii(lIlIiIII);
      ll1illIi[ilIl1lli] = ll1illIi[ilIl1lli] || [];
      ll1illIi[ilIl1lli].push(lIlIiIII);
    }), ll1illIi;
  }
  async ["send"]() {
    if (this.msg?.["length"] > 0) {
      this.msg.push("\n时间：" + this.now() + " 时长：" + ((this.timestamp() - this.__start) / 1000).toFixed(2) + "s");
      if (this.bot) await notify.sendNotify("/" + this.name, this.msg.join(this.delimiter || ""));else {
        await notify.sendNotify(this.name, this.msg.join("\n"));
      }
    }
  }
  async ["verify"]() {
    let I1lIll1 = this.filename;
    function l11II1i1(Ilillll1) {
      return Ilillll1.trim().match(/([a-z_])*$/)[0];
    }
    let IilIilii = "109M95O106F120V95B",
      Il1l11l = "99M102F100O",
      iI1111ll = "109H99V",
      Il1i1lll = "102N97I99D116T111G114A121B",
      iI1lIIii = "112C112U",
      ilI1iIIl = "109N95G106B100K95U",
      i1IIilli = "119V120M",
      IIIllIlI = /[A-Z]/;
    IilIilii.concat(Il1l11l).split(IIIllIlI).map(lI1l1ill => +lI1l1ill).filter(i1Ii1iIi => i1Ii1iIi > 0).forEach(Ii111l1I => Il1l11l += String.fromCharCode(Ii111l1I));
    IilIilii.concat(iI1111ll).split(IIIllIlI).map(iiIilIl1 => +iiIilIl1).filter(i1I11lIl => i1I11lIl > 0).forEach(I1i1llli => iI1111ll += String.fromCharCode(I1i1llli));
    IilIilii.concat(Il1i1lll).split(IIIllIlI).map(ilIiI1lI => +ilIiI1lI).filter(lIiIi1li => lIiIi1li > 0).forEach(Ii1liiII => Il1i1lll += String.fromCharCode(Ii1liiII));
    IilIilii.concat(iI1lIIii).split(IIIllIlI).map(ii11iii1 => +ii11iii1).filter(lIilIlil => lIilIlil > 0).forEach(liilIll => iI1lIIii += String.fromCharCode(liilIll));
    ilI1iIIl.concat(i1IIilli).split(IIIllIlI).map(lIlIii11 => +lIlIii11).filter(IIIillIi => IIIillIi > 0).forEach(II1Ili1 => i1IIilli += String.fromCharCode(II1Ili1));
    this.appId = I1lIll1 ? this.name.slice(0, 1) === String.fromCharCode(77) ? I1lIll1.includes(l11II1i1(Il1l11l)) ? "10032" : I1lIll1.includes(l11II1i1(iI1111ll)) ? "10028" : I1lIll1.includes(l11II1i1(Il1i1lll)) ? "10001" : I1lIll1.includes(l11II1i1(iI1lIIii)) ? "10038" : I1lIll1.includes(l11II1i1(i1IIilli)) ? "wx" : "" : "" : "";
    this.appId ? this.algo = await this._algo() : "";
  }
  async ["auth"]() {
    if (this.activityUrl) {
      let l1IlIiI1 = "no";
      try {
        let {
          data: l1II111
        } = await this.request("http://43.138.16.15:7705/auth", {
          "Cookie": "authority",
          "token": apiToken,
          "_vs": this.superVersion,
          "_cs": this.cookies?.["length"] || 0
        }, {
          "data": this.activityUrl,
          "_ph": this.filename,
          "_pd": l1IlIiI1
        });
        l1II111.data?.["notity"] && this.msg.push(l1II111.data?.["notity"]);
        if (l1II111.status !== 0) {
          this.msg.push(l1II111.msg);
          throw new Error(l1II111.msg);
        }
        this.ownerUuid = l1II111.data?.["ownerUuid"] || "";
      } catch (i1l1) {
        if (this.msg.length > 0) {
          await this.send();
        }
        throw new Error("authority false");
      }
    }
  }
  async ["wait"](lIiiII1I, lII1iiiI) {
    if (lIiiII1I <= 0) return;
    return lII1iiiI ? new Promise(IiiillIi => setTimeout(IiiillIi, this.random(lIiiII1I, lII1iiiI))) : new Promise(iI1lii => setTimeout(iI1lii, lIiiII1I));
  }
  ["putMsg"](Il1l1iIi) {
    _currentTime = Date.now();
    Il1l1iIi += "";
    this.log(Il1l1iIi);
    let I11ilIii = [[" ", ""], ["优惠券", "券"], ["东券", "券"], ["元京东E卡", "元E卡"], ["店铺", ""], ["恭喜", ""], ["获得", ""]];
    for (let iii1lllI of I11ilIii) {
      Il1l1iIi = Il1l1iIi.replace(iii1lllI[0], iii1lllI[1]);
    }
    Il1l1iIi?.["includes"]("期间下单") && (this.expire = true);
    if (this.bot) {
      this.msg.push(Il1l1iIi);
    } else {
      let liIIl1l = (this.accounts[this.username]?.["remarks"] || this.username) + this.index;
      if (this.msg.length > 0 && this.msg.filter(I1ilii => I1ilii.includes(liIIl1l)).length > 0) {
        for (let lili1I1 = 0; lili1I1 < this.msg.length; lili1I1++) {
          if (this.msg[lili1I1].includes(liIIl1l)) {
            this.msg[lili1I1] = this.msg[lili1I1].split(" ")[0] + "" + [this.msg[lili1I1].split(" ")[1], Il1l1iIi].join(",");
            break;
          }
        }
      } else this.msg.push("【" + liIIl1l + "】" + Il1l1iIi);
    }
  }
  ["getRemarks"](IiII11iI) {
    return this.accounts[IiII11iI]?.["remarks"] || IiII11iI;
  }
  ["md5"](lIllilI) {
    return CryptoJS.MD5(lIllilI).toString();
  }
  ["hmacSHA256"](liIlIi1l, IlIl1i1) {
    return CryptoJS.HmacSHA256(liIlIi1l, IlIl1i1).toString();
  }
  ["encryptCrypto"](l1i11li, ilii1II, il1l1IiI, iIIiII1I, iiIil11, llillliI, ll1i1i1I = "Utf8", I1iI111 = "Hex") {
    return CryptoJS[l1i11li].encrypt(CryptoJS.enc[ll1i1i1I].parse(iIIiII1I), CryptoJS.enc.Utf8.parse(iiIil11), {
      "mode": CryptoJS.mode[ilii1II],
      "padding": CryptoJS.pad[il1l1IiI],
      "iv": CryptoJS.enc.Utf8.parse(llillliI)
    }).ciphertext.toString(CryptoJS.enc[I1iI111]);
  }
  ["decryptCrypto"](i1i11IIl, Il1II1, lili1Iil, IIlIlI1I, llIIiill, iI1lI111, IIilIIli = "Base64", IlIIli1i = "Utf8") {
    return CryptoJS[i1i11IIl].decrypt({
      "ciphertext": CryptoJS.enc[IIilIIli].parse(IIlIlI1I)
    }, CryptoJS.enc.Utf8.parse(llIIiill), {
      "mode": CryptoJS.mode[Il1II1],
      "padding": CryptoJS.pad[lili1Iil],
      "iv": CryptoJS.enc.Utf8.parse(iI1lI111)
    }).toString(CryptoJS.enc[IlIIli1i]);
  }
  ["rsaEncrypt"](I1l1I1li, Il1lIilI, li11I1l1) {
    I1l1I1li = "-----BEGIN PUBLIC KEY-----\n" + I1l1I1li + "\n-----END PUBLIC KEY-----";
    let I1iilli = new NodeRSA(I1l1I1li);
    return I1iilli.setOptions(Il1lIilI), I1iilli.encrypt(li11I1l1, "base64");
  }
  ["log"](...IillI1iI) {
    _currentTime = Date.now();
    this.s ? console.log(...IillI1iI) : console.log(this.now("HH:mm:ss.SSS") + " cookie" + this.index + " " + (this.accounts[this.username]?.["remarks"] || this.desensitizeString(this.username)), ...IillI1iI);
  }
  ["desensitizeString"](il11llI) {
    if (process.env?.["M_LOG_DESENSITIZE"]) return il11llI || "";
    if (!il11llI) return "";
    if (il11llI.length <= 4) {
      return il11llI;
    }
    const Iil1i11 = il11llI,
      IIli1I1l = Iil1i11.substring(0, 2),
      l1l1Il11 = Iil1i11.substring(Iil1i11.length - 2),
      ii11iill = Math.max(0, 8 - IIli1I1l.length - l1l1Il11.length),
      illilI1I = "*".repeat(ii11iill);
    return (IIli1I1l + illilI1I + l1l1Il11).padEnd(6, "*");
  }
  ["union"](lIlIiiIl, iliiI) {
    return Array.from(new Set([...lIlIiiIl.map(liil => liil + ""), ...iliiI.map(i1I1IiI1 => i1I1IiI1 + "")]));
  }
  ["intersection"](ll11iIIi, illiIIiI) {
    const lli1ll1i = ll11iIIi.map(lII1l1ll => lII1l1ll + "").filter(lli11ii1 => illiIIiI.map(ili1li1i => ili1li1i + "").includes(lli11ii1)),
      lIIiiIii = illiIIiI.map(Iiiilli1 => Iiiilli1 + "").filter(IiIlIlli => ll11iIIi.map(I1l1i => I1l1i + "").includes(IiIlIlli));
    return lli1ll1i.concat(lIIiiIii);
  }
  ["different"](i1lIIliI, lllliIll) {
    const ilIi11Il = i1lIIliI.map(IIIi1Il1 => IIIi1Il1 + "").filter(lIIIil1l => !lllliIll.map(li11i1iI => li11i1iI + "").includes(lIIIil1l)),
      I11iiiil = lllliIll.map(iiiIiii => iiiIiii + "").filter(lIlii1li => !i1lIIliI.map(II11II1l => II11II1l + "").includes(lIlii1li));
    return ilIi11Il.concat(I11iiiil);
  }
  ["build"](il1Ill1) {
    if (il1Ill1.match(/&callback=(jsonpCBK(.*))&/)) {
      let I1111li = il1Ill1.match(/&callback=(jsonpCBK(.*))&/);
      il1Ill1 = il1Ill1.replace(I1111li[1], this.randomCallback(I1111li[2].length || 0));
    }
    let lII1II11 = decodeURIComponent(this.getQueryString(il1Ill1, "_stk") || "");
    if (lII1II11) {
      let Il11liIl,
        i1ii11I1,
        ilIliilI = "",
        iliilIil = this.now("yyyyMMddHHmmssSSS").toString(),
        I1i1llii = this.algo.tk,
        lii1iiil = this.algo.fp,
        IIi1iI1 = this.algo.em;
      if (I1i1llii && lii1iiil && IIi1iI1) i1ii11I1 = IIi1iI1(I1i1llii, lii1iiil, iliilIil, this.appId, CryptoJS).toString(CryptoJS.enc.Hex);else {
        const I1l11li1 = "5gkjB6SpmC9s";
        I1i1llii = "tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc";
        lii1iiil = "9686767825751161";
        i1ii11I1 = CryptoJS.SHA512("" + I1i1llii + lii1iiil + iliilIil + this.appId + I1l11li1, I1i1llii).toString(CryptoJS.enc.Hex);
      }
      lII1II11.split(",").map((ill1il1i, li1I1lI) => {
        ilIliilI += ill1il1i + ":" + this.getQueryString(il1Ill1, ill1il1i) + (li1I1lI === lII1II11.split(",").length - 1 ? "" : "&");
      });
      Il11liIl = encodeURIComponent(["".concat(iliilIil), "".concat(lii1iiil), "".concat(this.appId), "".concat(I1i1llii), "".concat(CryptoJS.HmacSHA256(ilIliilI, i1ii11I1.toString()).toString(CryptoJS.enc.Hex))].join(";"));
      il1Ill1.match(/[?|&]h5st=(.*?)&/) && (il1Ill1 = il1Ill1.replace(il1Ill1.match(/[?|&]h5st=(.*?)&/)[1], "H5ST").replace(/H5ST/, Il11liIl));
      let i1IiiI1 = [/[?|&]_time=(\d+)/, /[?|&]__t=(\d+)/, /[?|&]_ts=(\d+)/, /[?|&]_=(\d+)/, /[?|&]t=(\d+)/, /[?|&]_cfd_t=(\d+)/];
      for (let liIIll1i of i1IiiI1) {
        il1Ill1.match(liIIll1i) && (il1Ill1 = il1Ill1.replace(il1Ill1.match(liIIll1i)[1], Date.now()));
      }
      let Iiillill = this._tk();
      if (il1Ill1.match(/strPgUUNum=(.*?)&/)) {
        il1Ill1 = il1Ill1.replace(il1Ill1.match(/strPgUUNum=(.*?)&/)[1], Iiillill.tk);
        il1Ill1.match(/strPhoneID=(.*?)&/) && (il1Ill1 = il1Ill1.replace(il1Ill1.match(/strPhoneID=(.*?)&/)[1], Iiillill.id));
        if (il1Ill1.match(/strPgtimestamp=(.*?)&/)) {
          il1Ill1 = il1Ill1.replace(il1Ill1.match(/strPgtimestamp=(.*?)&/)[1], Iiillill.ts);
        }
      }
      if (il1Ill1.match(/jxmc_jstoken=(.*?)&/)) {
        il1Ill1 = il1Ill1.replace(il1Ill1.match(/jxmc_jstoken=(.*?)&/)[1], Iiillill.tk);
        if (il1Ill1.match(/phoneid=(.*?)&/)) {
          il1Ill1 = il1Ill1.replace(il1Ill1.match(/phoneid=(.*?)&/)[1], Iiillill.id);
        }
        il1Ill1.match(/timestamp=(.*?)&/) && (il1Ill1 = il1Ill1.replace(il1Ill1.match(/timestamp=(.*?)&/)[1], Iiillill.ts));
      }
    }
    return il1Ill1;
  }
  ["getQueryString"](I1l1Il1, ilIl11I1) {
    let lili1Ill = new RegExp("(^|[&?])" + ilIl11I1 + "=([^&]*)(&|$)"),
      IllliiI1 = I1l1Il1.match(lili1Ill);
    if (IllliiI1 != null) {
      return unescape(IllliiI1[2]);
    }
    return "";
  }
  ["unique"](I1i1i1ll) {
    return Array.from(new Set(I1i1i1ll));
  }
  async ["logic"]() {
    console.log("default logic");
  }
  async ["before"]() {
    return -1;
  }
  async ["after"]() {
    return -1;
  }
  ["tryLock"](III11il, il11Ii) {
    try {
      return fs.accessSync("/jd/log/lock/" + il11Ii + "_" + III11il), false;
    } catch (i1llI1I1) {
      return true;
    }
  }
  ["setLock"](IlII1ilI, Ilili1lI) {
    try {
      try {
        fs.accessSync("/jd/log/lock");
      } catch (I1Ili1iI) {
        fs.mkdirSync("/jd/log/lock");
      }
      return fs.mkdirSync("/jd/log/lock/" + Ilili1lI + "_" + IlII1ilI), false;
    } catch (I1Iiii1I) {
      return true;
    }
  }
  ["match"](III1IiII, llI11il1) {
    III1IiII = III1IiII instanceof Array ? III1IiII : [III1IiII];
    for (let Ilii1li of III1IiII) {
      const lll1lII = Ilii1li.exec(llI11il1);
      if (lll1lII) {
        const IlIillli = lll1lII.length;
        if (IlIillli === 1) return lll1lII;else {
          if (IlIillli === 2) {
            return lll1lII[1];
          } else {
            const illlI11i = [];
            for (let illl11il = 1; illl11il < IlIillli; illl11il++) {
              illlI11i.push(lll1lII[illl11il]);
            }
            return illlI11i;
          }
        }
      }
    }
    return "";
  }
  ["matchAll"](lIiIIll, iIliI) {
    lIiIIll = lIiIIll instanceof Array ? lIiIIll : [lIiIIll];
    let iii11iI,
      li11IiIi = [];
    for (let I1lI11 of lIiIIll) {
      while ((iii11iI = I1lI11.exec(iIliI)) != null) {
        let Iii1iI1I = iii11iI.length;
        if (Iii1iI1I === 1) li11IiIi.push(iii11iI);else {
          if (Iii1iI1I === 2) li11IiIi.push(iii11iI[1]);else {
            let iIIi1111 = [];
            for (let lIlll11I = 1; lIlll11I < Iii1iI1I; lIlll11I++) {
              iIIi1111.push(iii11iI[lIlll11I]);
            }
            li11IiIi.push(iIIi1111);
          }
        }
      }
    }
    return li11IiIi;
  }
  async ["countdown"](llIIIII = 1, III1l1li = 200) {
    let II1iiil1 = new Date();
    if (llIIIII === 1 && II1iiil1.getMinutes() < 50 || llIIIII === 2 && II1iiil1.getMinutes() < 25 || llIIIII === 3 && II1iiil1.getMinutes() < 10 || llIIIII === 4 && II1iiil1.getMinutes() < 5) {
      return;
    }
    let lIIliIiI = III1l1li;
    if (llIIIII !== 9) {
      switch (llIIIII) {
        case 1:
          II1iiil1.setHours(II1iiil1.getHours() + 1), II1iiil1.setMinutes(0);
          break;
        case 2:
          II1iiil1.setMinutes(30);
          break;
        case 3:
          II1iiil1.setMinutes(15);
          break;
        case 4:
          II1iiil1.setMinutes(10);
          break;
        default:
          console.log("不支持");
      }
      II1iiil1.setSeconds(0);
      II1iiil1.setMilliseconds(0);
      lIIliIiI = II1iiil1.getTime() - Date.now() - III1l1li;
    }
    lIIliIiI > 0 && (console.log("需要等待时间" + lIIliIiI / 1000 + " 秒"), await this.wait(lIIliIiI));
  }
  ["readFileSync"](ll1ilII) {
    try {
      return fs.readFileSync(ll1ilII).toString();
    } catch (il1lI1Ii) {
      return console.log(ll1ilII, "文件不存在进行创建"), this.writeFileSync(ll1ilII, ""), "";
    }
  }
  ["writeFileSync"](li1ili1, illIliIi) {
    fs.writeFileSync(li1ili1, illIliIi);
  }
  ["random"](II1ll11, l1i1lil1) {
    return Math.min(Math.floor(II1ll11 + Math.random() * (l1i1lil1 - II1ll11)), l1i1lil1);
  }
  async ["taskToDo"](Il1iIl1l) {
    Il1iIl1l.data.taskList.filter(lIlIli1 => ![8, 15, 13].includes(lIlIli1.taskType * 1)).length === 0 && this.log("没有任务");
    let IillIl1l = Il1iIl1l.data.taskList;
    for (let I1liIiI1 of IillIl1l.filter(Iii1Ii11 => Iii1Ii11.status === 0 && (Iii1Ii11.completeCount < Iii1Ii11.finishNum || Iii1Ii11.completeCount < Iii1Ii11.maxNum)) || []) {
      try {
        if ([1, 2, 4, 10, 12, 14].includes(I1liIiI1.taskType)) {
          await this.api("/api/basic/task/toDo", {
            "skuId": "",
            "taskId": I1liIiI1.taskId
          });
        } else {
          if ([3, 5, 6, 7, 9].includes(I1liIiI1.taskType)) {
            let Il1l1lii = I1liIiI1.skuInfoVO.filter(iiliI11l => iiliI11l.status === 0);
            for (let lill1Il1 = 0; lill1Il1 < Il1l1lii.length && (lill1Il1 < I1liIiI1.finishNum || lill1Il1 < I1liIiI1.maxNum); lill1Il1++) {
              await this.api("/api/basic/task/toDo", {
                "skuId": Il1l1lii[lill1Il1].skuId,
                "taskId": I1liIiI1.taskId
              });
            }
          }
        }
      } catch (iIIIlli1) {
        this.log(iIIIlli1.message, JSON.stringify(I1liIiI1));
      }
    }
  }
  async ["notify"](I1li1II, IIlllI11) {
    return notify.sendNotify(I1li1II, IIlllI11);
  }
  async ["get"](IIll1lli, i1Ill) {
    return IIll1lli = this.appId ? this.build(IIll1lli) : IIll1lli, new Promise((iiIli11I, lii1lli) => {
      $.get(IIll1lli, {
        "headers": i1Ill
      }).then(i1111iI1 => iiIli11I(this.handler(i1111iI1) || i1111iI1)).catch(l1IliiiI => lii1lli(l1IliiiI));
    });
  }
  async ["post"](iilIiI1, iiiIIII1, lIlI1lii) {
    return iilIiI1 = this.appId ? this.build(iilIiI1) : iilIiI1, new Promise((Il1IiiIi, ililiIli) => {
      $.post(iilIiI1, iiiIIII1, {
        "headers": lIlI1lii
      }).then(IiIlliil => Il1IiiIi(this.handler(IiIlliil) || IiIlliil)).catch(II1Iili1 => ililiIli(II1Iili1));
    });
  }
  async ["request"](Il1IiI, ilii11l1, illI1I1) {
    return new Promise((IIi1ii1l, liI1iii) => {
      let IIilill1 = setTimeout(() => {
          console.log("超时异常进行重试");
          liI1iii(new Error("Request timeout"));
        }, 50000),
        iIlI1lIi = ilii11l1?.["headers"] ? ilii11l1 : {
          "headers": ilii11l1
        };
      (illI1I1 ? $.post(Il1IiI, illI1I1, iIlI1lIi) : $.get(Il1IiI, iIlI1lIi)).then(lIIIllli => {
        clearTimeout(IIilill1);
        this.__lt(lIIIllli);
        IIi1ii1l(lIIIllli);
      }).catch(ilill11l => {
        clearTimeout(IIilill1);
        liI1iii(ilill11l);
      });
    });
  }
  ["__lt"](i1il11Ii) {
    let ll1ll1iI = i1il11Ii?.["headers"]["set-cookie"] || i1il11Ii?.["headers"]["Set-Cookie"] || [],
      I1ill11l = typeof ll1ll1iI != "object" ? ll1ll1iI.split(",") : ll1ll1iI;
    for (let ll1I1lll of I1ill11l) {
      let i1iIi1Ii = ll1I1lll.split(";")[0].trim().split("=");
      this.tickets.set(i1iIi1Ii[0], i1iIi1Ii[1]);
    }
    this.ticket = "";
    for (let [lI1llIlI, i1l1lIii] of this.tickets.entries()) {
      this.ticket += lI1llIlI + "=" + i1l1lIii + ";";
    }
  }
  ["handler"](Il1lIl1I) {
    let iiliilI1 = Il1lIl1I?.["data"] || Il1lIl1I?.["body"] || Il1lIl1I;
    if (!iiliilI1) return;
    if (typeof iiliilI1 === "string") {
      if (iiliilI1.startsWith("<") || iiliilI1.startsWith("(function")) return iiliilI1;else {
        iiliilI1 = iiliilI1.replace(/[\n\r| ]/g, "");
        if (iiliilI1.includes("try{jsonpCB")) iiliilI1 = iiliilI1.replace(/try{jsonpCB.*\({/, "{").replace(/}\)([;])?}catch\(e\){}/, "}");else {
          if (iiliilI1.includes("jsonpCB")) {
            let II1iil1I = iiliilI1.replace(/[\n\r]/g, "").replace(/jsonpCB.*\({/, "{");
            iiliilI1 = II1iil1I.substring(0, II1iil1I.length - 1);
          } else iiliilI1.match(/try{.*\({/) ? iiliilI1 = iiliilI1.replace(/try{.*\({/, "{").replace(/}\)([;])?}catch\(e\){}/, "}") : iiliilI1 = /.*?({.*}).*/g.exec(iiliilI1)?.[1] || "{}";
        }
        return JSON.parse(iiliilI1);
      }
    }
    return iiliilI1;
  }
  ["randomNum"](IIIIiII) {
    IIIIiII = IIIIiII || 32;
    let iiliI11I = "0123456789",
      iiiiIiIi = iiliI11I.length,
      IliIiiii = "";
    for (let lliIl1i1 = 0; lliIl1i1 < IIIIiII; lliIl1i1++) {
      IliIiiii += iiliI11I.charAt(Math.floor(Math.random() * iiiiIiIi));
    }
    return IliIiiii;
  }
  ["randomString"](illiI1Il) {
    return this.uuid();
  }
  ["randomPattern"](Ii1IIi1i, l1li1l1i = "abcdef0123456789") {
    let IlIi1i = "";
    for (let i11ilIi1 of Ii1IIi1i) {
      if (i11ilIi1 == "x") {
        IlIi1i += l1li1l1i.charAt(Math.floor(Math.random() * l1li1l1i.length));
      } else i11ilIi1 == "X" ? IlIi1i += l1li1l1i.charAt(Math.floor(Math.random() * l1li1l1i.length)).toUpperCase() : IlIi1i += i11ilIi1;
    }
    return IlIi1i;
  }
  ["randomCallback"](lilii11I = 1) {
    let iiI1iI1I = "abcdefghigklmnopqrstuvwsyz",
      i111iiil = iiI1iI1I.length,
      ll11Ii1l = "";
    for (let i1iIlll1 = 0; i1iIlll1 < lilii11I; i1iIlll1++) {
      ll11Ii1l += iiI1iI1I.charAt(Math.floor(Math.random() * i111iiil));
    }
    return "jsonpCBK" + ll11Ii1l.toUpperCase();
  }
  ["randomArray"](i11iI11i, i11iIl1l) {
    i11iIl1l = i11iIl1l || i11iI11i.length;
    let iIlIllI = i11iI11i.slice(0),
      llII1I1i = i11iI11i.length,
      lilIli = llII1I1i - i11iIl1l,
      il1illI,
      I1lIi1l1;
    while (llII1I1i-- > lilIli) {
      I1lIi1l1 = Math.floor((llII1I1i + 1) * Math.random());
      il1illI = iIlIllI[I1lIi1l1];
      iIlIllI[I1lIi1l1] = iIlIllI[llII1I1i];
      iIlIllI[llII1I1i] = il1illI;
    }
    return iIlIllI.slice(lilIli);
  }
  ["now"](l1l1ilIl) {
    return format(Date.now(), l1l1ilIl || "yyyy-MM-dd HH:mm:ss.SSS");
  }
  ["formatDate"](Il1iIIIi, i1lI1III) {
    return format(typeof Il1iIIIi === "object" ? Il1iIIIi : new Date(typeof Il1iIIIi === "string" ? Il1iIIIi * 1 : Il1iIIIi), i1lI1III || "yyyy-MM-dd");
  }
  ["formatDateTime"](iI1lIiIl, i1iIliiI) {
    return format(typeof iI1lIiIl === "object" ? iI1lIiIl : new Date(typeof iI1lIiIl === "string" ? iI1lIiIl * 1 : iI1lIiIl), i1iIliiI || "yyyy-MM-dd HH:mm:ss");
  }
  ["parseDate"](llIl1lii) {
    return new Date(Date.parse(llIl1lii.replace(/-/g, "/")));
  }
  ["timestamp"]() {
    return new Date().getTime();
  }
  ["uuid"](i11Ill1i = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx") {
    return i11Ill1i.replace(/[xy]/g, function (Iilll11l) {
      const ilIli1i = 16 * Math.random() | 0,
        lll1Il1l = "x" === Iilll11l ? ilIli1i : 3 & ilIli1i | 8;
      return lll1Il1l.toString(36);
    });
  }
  async ["unfollow"](iii1llll = this.shopId) {
    let I1il1ill = {
        "authority": "api.m.jd.com",
        "accept": "*/*",
        "origin": "https://shop.m.jd.com",
        "referer": "https://shop.m.jd.com/",
        "user-agent": this.UA,
        "Cookie": this.cookie
      },
      IlIl11Ii = {
        "shopId": iii1llll,
        "follow": false
      },
      iIll111l = "https://api.m.jd.com/client.action?functionId=whx_followShop&appid=shop_view&body=" + encodeURIComponent(JSON.stringify(IlIl11Ii)),
      Ii1l111 = await this.get(iIll111l, I1il1ill);
    return Ii1l111;
  }
  async ["getShopInfo"](li1iiil1 = this.venderId, liII111i = this.shopId) {
    try {
      if (openCardMode.includes("wh5")) {
        let lliiliI1 = {
            "authority": "api.m.jd.com",
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "origin": "https://shop.m.jd.com",
            "referer": "https://shop.m.jd.com/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.42"
          },
          IliIlIl1 = "https://api.m.jd.com/client.action?functionId=whx_getMShopOutlineInfo&appid=shop_view&clientVersion=11.0.0&client=wh5&body=" + encodeURIComponent(JSON.stringify({
            "shopId": liII111i
          })),
          {
            status: lll1li1i,
            data: lI1IlIlI
          } = await this.request(IliIlIl1, lliiliI1);
        return lI1IlIlI.data?.["shopInfo"];
      } else {
        let llII1i1 = await this.sign("getShopHomeBaseInfo", {
            "source": "app-shop",
            "latWs": "0",
            "lngWs": "0",
            "displayWidth": "1098.000000",
            "sourceRpc": "shop_app_home_home",
            "lng": "0",
            "lat": "0",
            "venderId": li1iiil1,
            "navigationAbTest": "1"
          }),
          il1Iilii = {
            "J-E-H": "",
            "Connection": "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Type": "application/x-www-form-urlencoded",
            "Host": "api.m.jd.com",
            "Referer": "",
            "J-E-C": "",
            "Accept-Language": "zh-Hans-CN;q=1, en-CN;q=0.9",
            "Accept": "*/*",
            "User-Agent": "JD4iPhone/167841 (iPhone; iOS; Scale/3.00)"
          },
          Il11l1l = "https://api.m.jd.com/client.action?functionId=" + llII1i1.fn,
          {
            status: IilII1il,
            data: lii1Il1
          } = await this.request(Il11l1l, il1Iilii, llII1i1.sign);
        return lii1Il1.result?.["shopInfo"];
      }
    } catch (lIllliII) {
      return console.log(lIllliII), {};
    }
  }
  async ["getShopBaseInfo"](iIlII11 = this.venderId, iiIllii = this.shopId) {
    let liilIIil = "";
    if (iIlII11) liilIIil = "https://chat1.jd.com/api/checkChat?callback=jQuery7749929&venderId=" + iIlII11 + "&_=" + this.timestamp();else {
      if (iiIllii) {
        liilIIil = "https://chat1.jd.com/api/checkChat?callback=jQuery7749929&shopId=" + iiIllii + "&_=" + this.timestamp();
      }
    }
    let iIil1ll1 = await this.request(liilIIil, {
      "authority": "chat1.jd.com",
      "Accept": "*/*",
      "Connection": "keep-alive",
      "Cookie": this.cookie,
      "User-Agent": this.ua(),
      "Accept-Language": "zh-cn",
      "Accept-Encoding": "gzip, deflate",
      "referer": "https://mall.jd.com/shopBrandMember-" + (iIlII11 || iiIllii) + ".html"
    });
    const iIIill1 = JSON.parse(iIil1ll1?.["data"]?.["replace"](/^jQuery\d+\(/, "")?.["replace"](/\);$/, "") || "{}");
    return {
      "shopId": iIIill1.shopId,
      "venderId": iIIill1.venderId,
      "shopName": iIIill1.seller
    };
  }
  async ["getShopName"](llI1iiII = this.venderId, iI1lI11i = this.shopId) {
    this.shopName = (await this.getShopBaseInfo())?.["shopName"];
    if (!this.shopName) {
      let iIlllili = await this.getShopInfo(llI1iiII, iI1lI11i);
      this.shopName = iIlllili?.["shopName"];
    }
    return this.shopName || "未知";
  }
  async ["sendTGMsg"](I1iiili1) {
    await this.sendMessage(process.env.TG_USER_ID, I1iiili1);
  }
  async ["sendMessage"](l1lliI1I = process.env.TG_USER_ID, ll1I1Iil, illill1l = 1, llii1Ili = process.env.TG_BOT_TOKEN) {
    if (mode) return;
    let iIIiIlIi = "https://api.telegram.org/bot" + llii1Ili + "/sendMessage",
      ill11ii1 = {
        "chat_id": l1lliI1I,
        "text": ll1I1Iil,
        "disable_web_page_preview": true
      },
      i1iI1ii = {
        "Content-Type": "application/json",
        "Cookie": "10089"
      };
    process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT && ($.defaults.proxy = false, $.defaults.httpsAgent = tunnel.httpsOverHttp({
      "proxy": {
        "host": process.env.TG_PROXY_HOST,
        "port": process.env.TG_PROXY_PORT * 1
      }
    }));
    let {
      data: Ii11l1il
    } = await this.request(iIIiIlIi, i1iI1ii, ill11ii1);
    if (Ii11l1il?.["description"]?.["includes"]("long")) {
      await this.sendMessage(l1lliI1I, ll1I1Iil.substring(0, 300), ++illill1l);
      return;
    }
    !Ii11l1il?.["ok"] && illill1l < 5 && ($.log("重试中", ll1I1Iil), await $.wait(1000, 2000), await this.sendMessage(l1lliI1I, ll1I1Iil, ++illill1l));
  }
  ["ua"](IlI1l1II = "jd") {
    return JDAPP_USER_AGENTS[this.random(0, JDAPP_USER_AGENTS.length)];
  }
  async ["wxStop"](IIIiiii) {
    let II1II11i = false;
    for (let lliIIliI of stopKeywords) {
      if (lliIIliI && IIIiiii?.["includes"](lliIIliI)) {
        II1II11i = true;
        this.expire = true;
        break;
      }
    }
    return II1II11i;
  }
  async ["wxAddressStop"](liIiiIl1) {
    return liIiiIl1 && liIiiIl1.match(new RegExp("(" + addressStopKeywords.join("|") + ")")) != null;
  }
  async ["wxAddressStopRule"](l1l1ii1 = this.rule) {
    try {
      if (!l1l1ii1 && this.urlPrefix) {
        let iIlI1ili = await this.api("/api/active/getRule", {});
        if (iIlI1ili?.["resp_code"] === 0) {
          l1l1ii1 = iIlI1ili?.["data"];
        }
      }
    } catch (II1Iill1) {
      console.log(II1Iill1);
    }
    return l1l1ii1 && l1l1ii1.match(new RegExp("(" + addressStopKeywordsRule.join("|") + ")")) != null;
  }
  ["_tk"]() {
    let llIlI1 = function (liIIIi11) {
        let IllIi1l1 = "abcdefghijklmnopqrstuvwxyz1234567890",
          IlIii11i = "";
        for (let illIl1li = 0; illIl1li < liIIIi11; illIl1li++) {
          IlIii11i += IllIi1l1[Math.floor(IllIi1l1.length * Math.random())];
        }
        return IlIii11i;
      }(40),
      II1IIiiI = Date.now().toString(),
      IiIl1iil = this.md5("" + decodeURIComponent(this.username) + II1IIiiI + llIlI1 + "tPOamqCuk9NLgVPAljUyIHcPRmKlVxDy");
    return {
      "ts": II1IIiiI,
      "id": llIlI1,
      "tk": IiIl1iil
    };
  }
  async ["_algo"](illl1lli = 0) {
    if (this.appId === "wx") {
      this.tickets = new Map();
      let IIi1I1i = {
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1",
        "Accept-Language": "zh-cn",
        "Cookie": this.cookie
      };
      try {
        if (this.domain.includes("lzkj") || this.domain.includes("lzdz") || this.domain.includes("cjhy")) await this.request("https://" + this.domain + "/wxTeam/activity?activityId=" + this.activityId, IIi1I1i);else {
          await this.request(this.activityUrl, IIi1I1i);
        }
      } catch (III1iil) {
        if (illl1lli < 3) {
          if (this.isProxy(III1iil.message)) await this.routerProxy(illl1lli), this.msg.push("493启用代理重试" + illl1lli), this.log("493去重试，第" + illl1lli + "次重试...");else III1iil.message?.["includes"]("493") && (await this.router());
          return await this._algo(++illl1lli);
        }
      }
      return "";
    } else {
      let ll11iliI = function () {
          let ilIilliI = "0123456789",
            Il111111 = 13,
            I1I1ll1i = "";
          for (; Il111111--;) {
            I1I1ll1i += ilIilliI[Math.random() * ilIilliI.length | 0];
          }
          return (I1I1ll1i + Date.now()).slice(0, 16);
        }(),
        iiII1I1i = await this.post("https://cactus.jd.com/request_algo?g_ty=ajax", JSON.stringify({
          "version": "1.0",
          "fp": ll11iliI,
          "appId": this.appId,
          "timestamp": this.timestamp(),
          "platform": "web",
          "expandParams": ""
        }), {
          "Authority": "cactus.jd.com",
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
          "Content-Type": "application/json",
          "Origin": "https://st.jingxi.com",
          "Referer": "https://st.jingxi.com/"
        });
      return {
        "fp": ll11iliI.toString(),
        "tk": iiII1I1i?.["data"]?.["result"]?.["tk"] || iiII1I1i?.["result"]?.["tk"],
        "em": new Function("return " + (iiII1I1i?.["data"]?.["result"]?.["algo"] || iiII1I1i?.["result"]?.["algo"]))()
      };
    }
  }
  async ["routerProxy"](I1II1i1 = 0) {
    if (wxProxyEnable === 1) {
      return;
    }
    if (!proxies.find(i1IllI => !i1IllI.close)) {
      this.log("所有代理已关闭");
      this.expire = true;
      this.proxy = null;
      return;
    }
    this.proxy = proxies.filter(lIi1ilIl => !lIi1ilIl.close)[0];
    this.log("开始从M_WX_PROXY_URL" + (this.proxy.index - 1 || "") + "获取代理");
    let l1il1lI1 = await this.getProxyByUrl(this.proxy);
    !l1il1lI1 && (await this.routerProxy());
  }
  async ["getProxyByUrl"](Iili1IIi) {
    let ili1iI1I = Iili1IIi.url;
    var ili11il1 = false;
    try {
      $.defaults.proxy = false;
      $.defaults.httpsAgent = false;
      $.defaults.httpAgent = false;
      let ilii1liI = await $.get(ili1iI1I);
      if (ili1iI1I.includes("=json")) {
        let i1IliiiI = JSON.stringify(ilii1liI.data),
          il11Illi = ilii1liI.data.data;
        if (ilii1liI.data.data?.["list"]) {
          il11Illi = ilii1liI.data.data.list;
        }
        if (il11Illi) {
          if (il11Illi[0]?.["port"]) ili11il1 = true, this.log("获取到的IP:" + il11Illi[0].ip + ":" + il11Illi[0].port), await this.setProxy(il11Illi[0].ip + ":" + il11Illi[0].port);else {
            const Ii1l11lI = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+|[a-zA-Z0-9.-]+:\d+)/,
              II1l11iI = i1IliiiI.match(Ii1l11lI);
            if (II1l11iI) this.log("获取到的IP:" + II1l11iI[0]), ili11il1 = true, await this.setProxy(II1l11iI[0]);else {
              proxies.filter(Il1i1il1 => Il1i1il1.index = Iili1IIi.index)[0].close = true;
              this.log(JSON.stringify(i1IliiiI));
            }
          }
        } else {
          proxies.filter(II111lii => II111lii.index = Iili1IIi.index)[0].close = true;
          this.log(JSON.stringify(i1IliiiI));
        }
      } else {
        let lIIiiI1l = ilii1liI.data.toString().replace("\r\n", "").replace("\n", ""),
          lIIlill1 = lIIiiI1l?.["includes"]("@") ? lIIiiI1l.split("@")[0] : "";
        const liII11I = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+|[a-zA-Z0-9.-]+:\d+)/,
          I1Il11Il = lIIiiI1l.match(liII11I);
        I1Il11Il ? (this.log("获取到的IP:" + I1Il11Il[0]), ili11il1 = true, await this.setProxy(I1Il11Il[0], lIIlill1)) : (proxies.filter(IlIii1l => IlIii1l.index = Iili1IIi.index)[0].close = true, this.log(JSON.stringify(lIIiiI1l)));
      }
    } catch (iiiiIIii) {
      this.log("M_WX_PROXY_URL" + (Iili1IIi.index - 1 || "") + "代理获取异常，切换下一个");
      proxies.filter(l1i1Ili => l1i1Ili.index = Iili1IIi.index)[0].close = true;
    }
    return ili11il1;
  }
  async ["setProxy"](iliIi11l, llliiiIl = "") {
    let il1i11i1 = iliIi11l.split(":");
    $.defaults.proxy = false;
    let li1IiI11 = {
      "host": il1i11i1[0],
      "port": il1i11i1[1]
    };
    llliiiIl && (li1IiI11.proxyAuth = llliiiIl);
    $.defaults.httpsAgent = tunnel.httpsOverHttp({
      "proxy": li1IiI11
    });
    $.defaults.httpAgent = tunnel.httpsOverHttp({
      "proxy": li1IiI11
    });
  }
  async ["router"]() {
    if (reRouterEnable === 1) return;
    !fs.existsSync("magic.lock") && fs.writeFileSync("magic.lock", Date.now().toString());
    let Ii1illi1 = fs.readFileSync("magic.lock").toString() * 1;
    (Date.now() - Ii1illi1) / 1000 > resetRouterTimeInterval && (fs.writeFileSync("magic.lock", Date.now().toString()), await notify.sendNotify("M自动重新拨号", this.filename), await notify.sendNotify(reRouterMsg, ""), await this.wait(3 * 1000, 5 * 1000));
  }
  async ["isvObfuscator"](lil1l1l1 = enableCacheToken, lIil111I = isvObfuscatorRetry, I1lllIl = this.cookie) {
    let i1l1iili = decodeURIComponent(I1lllIl.match(/pt_pin=(.+?);/) && I1lllIl.match(/pt_pin=(.+?);/)[1]);
    if (lil1l1l1 === 1) {
      if (!fs.existsSync("tokens")) {
        fs.mkdirSync("tokens");
      }
      let iliIllIi = JSON.parse(this.readFileSync("tokens/" + i1l1iili + ".json") || "{}");
      if (iliIllIi && iliIllIi.token && iliIllIi?.["expireTime"] > this.timestamp()) {
        return this.log("缓存获取 isvToken"), this.Token = iliIllIi.token, this.isvToken = iliIllIi.token, {
          "code": "0",
          "token": iliIllIi.token
        };
      }
    }
    let I1l1l11 = "body=%7B%22url%22%3A%22https%3A%2F%2Fcjhy-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&uuid=b024526b380d35c9e3&client=apple&clientVersion=10.0.10&st=1646999134786&sv=111&sign=fd9417f9d8e872da6c55102bd69da99f";
    try {
      let ililil = await this.sign("isvObfuscator", {
        "id": "",
        "url": "https://" + this.domain
      });
      if (ililil.sign) {
        I1l1l11 = ililil.sign;
      }
      let li1i11il = "https://api.m.jd.com/client.action?functionId=isvObfuscator",
        IiI1iiii = {
          "Accept": "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-cn",
          "Connection": "keep-alive",
          "Content-Type": "application/x-www-form-urlencoded",
          "Host": "api.m.jd.com",
          "Cookie": I1lllIl,
          "User-Agent": "JD4iPhone/168069 (iPhone; iOS 13.7; Scale/3.00)"
        };
      this.log("实时获取 isvToken");
      let {
        data: liillIll
      } = await this.request(li1i11il, IiI1iiii, I1l1l11);
      if (lil1l1l1 && liillIll?.["code"] === "0" && liillIll.token) {
        if (lil1l1l1) {
          let IIlII1Ii = {
            "expireTime": this.timestamp() + this.random(tokenCacheMin, tokenCacheMax) * 60 * 1000,
            "token": liillIll.token
          };
          this.writeFileSync("tokens/" + i1l1iili + ".json", JSON.stringify(IIlII1Ii));
        }
      } else {
        if (liillIll?.["code"] === "3" && liillIll?.["errcode"] === 264) {
          this.putMsg("CK已失效");
          throw new Error("CK已失效");
        }
      }
      return this.isvToken = liillIll.token, this.Token = liillIll.token, liillIll;
    } catch (IIiiI11I) {
      this.log(IIiiI11I.message);
      if (lIil111I > 0 && this.isProxy(IIiiI11I.message)) return this.log("第" + (isvObfuscatorRetry - lIil111I) + "去重试isvObfuscator接口,等待" + isvObfuscatorRetryWait + "秒"), await this.routerProxy(), await this.isvObfuscator(lil1l1l1, --lIil111I);
    }
    this.Token = "";
    throw new Error("获取Token失败");
    return {
      "code": "1",
      "token": ""
    };
  }
  async ["getSimpleActInfoVo"](Il1illI1 = "customer/getSimpleActInfoVo", lI1il = 1) {
    if (this.venderId && this.shopId && this.activityType) {
      await this.initPinToken();
      return;
    }
    let lI1li1I = await this.api(Il1illI1, lI1il === 1 ? "activityId=" + this.activityId : lI1il);
    if (!lI1li1I?.["result"] || !lI1li1I?.["data"]) {
      this.putMsg("手动确认");
      this.expire = true;
      throw new Error("活动已结束");
    }
    this.venderId = lI1li1I.data?.["venderId"] || this.venderId;
    this.shopId = lI1li1I.data?.["shopId"] || this.shopId;
    this.activityType = lI1li1I.data?.["activityType"] || this.activityType;
    await this.initPinToken();
  }
  async ["initPinToken"]() {
    try {
      if (this.activityUrl.includes("activityType")) {
        if (!notInitPinTokenRegex.test(this.activityUrl)) {
          if (this.defenseUrls && this.defenseUrls.length === 0) {
            let lII1i1ll = await this.api("api/user-info/getDefenseUrls", "");
            this.defenseUrls = lII1i1ll.data.map(ilIlIiIi => ilIlIiIi.interfaceName);
          }
        }
        await this.api("api/user-info/initPinToken?source=01&status=1&activityId=" + this.activityId + "&uuid=" + this.uuid() + "&jdToken=" + this.isvToken + "&shopId=" + this.shopId + "&clientTime=" + Date.now() + "&shareUserId=" + (this.shareUserId || ""), "");
      } else {
        if (this.defenseUrls && this.defenseUrls.length === 0) {
          let i1llIlll = await this.api("customer/getDefenseUrls", "");
          this.defenseUrls = i1llIlll.data;
        }
        await this.api("customer/initPinToken?source=01&status=1&activityId=" + this.activityId + "&uuid=" + this.uuid() + "&jdToken=" + this.isvToken + "&venderId=" + this.venderId + "&shopId=" + this.shopId + "&clientTime=" + Date.now() + "&shareUserId=" + (this.shareUserId || ""), "");
      }
    } catch (IliiiliI) {
      console.log(IliiiliI);
    }
  }
  async ["getMyPing"](lIi1II1i = "customer/getMyPing", l1i1I = 0) {
    try {
      let IiI1lIli = await this.api(lIi1II1i, "userId=" + this.venderId + "&token=" + this.Token + "&pin=&fromType=APP&riskType=0");
      this.Pin = "";
      if (!IiI1lIli.result) {
        if (IiI1lIli.errorMessage.includes("请联系商家")) {
          this.expire = true;
          this.putMsg("商家token过期");
          throw new Error(IiI1lIli.errorMessage);
        }
        if (l1i1I < 3 && !IiI1lIli.errorMessage?.["includes"]("活动太火爆")) this.putMsg("重试pin获取"), await this.getMyPing(lIi1II1i, ++l1i1I);else {
          this.putMsg(IiI1lIli.result.errorMessage);
          return;
        }
      }
      let Ii1iIlI = IiI1lIli.data.secretPin;
      this.nickname = IiI1lIli.data.nickname;
      this.Pin = this.domain.includes("cjhy") ? encodeURIComponent(encodeURIComponent(Ii1iIlI)) : encodeURIComponent(Ii1iIlI);
    } catch (lIll11I1) {
      this.putMsg(lIll11I1?.["message"]);
      this.nickname = this.username;
      let lIiI11li = this.tickets.get("AUTH_C_USER");
      this.Pin = lIiI11li || encodeURIComponent(lIiI11li) || this.domain.includes("cjhy") ? encodeURIComponent(encodeURIComponent(lIiI11li)) : encodeURIComponent(lIiI11li);
    }
  }
  async ["accessLog"](Iili1iII = "" + (this.domain.includes("cjhy") ? "common/accessLog" : "common/accessLogWithAD")) {
    await this.api(Iili1iII, "venderId=" + this.venderId + "&code=" + this.activityType + "&pin=" + this.Pin + "&activityId=" + this.activityId + "&pageUrl=" + encodeURIComponent(this.activityUrl) + "&subType=app&adSource=");
  }
  async ["sign"](liiIill, lil1lii1 = {}) {
    let lIiIl1i1 = {},
      lll11lii = {
        "fn": liiIill,
        "body": lil1lii1
      },
      IlI1Il11 = {
        "token": apiToken,
        "Cookie": 123
      };
    const I111Ilil = $.defaults.httpsAgent,
      illiIi1I = $.defaults.httpsAgent;
    $.defaults.httpsAgent = false;
    $.defaults.httpAgent = false;
    try {
      let {
        data: ilIIIi
      } = await this.request(signMode.includes("server") ? "http://172.17.0.1:17840/sign" : apiSignUrl, IlI1Il11, lll11lii);
      return {
        "fn": ilIIIi.fn,
        "sign": ilIIIi.body
      };
    } catch (Iil1i1li) {
      console.log("sign解析接口失效: " + Iil1i1li.message);
    } finally {
      $.defaults.httpsAgent = I111Ilil;
      $.defaults.httpAgent = illiIi1I;
    }
    return lIiIl1i1;
  }
  async ["lzdz4Login"]() {
    await this.api("wxCommonInfo/token?t=" + Date.now(), "");
    await this.getMyPing("customer/getMyCidPing");
    this.tickets.set("AUTH_CUSER", this.Pin);
    await this.accessLog();
  }
  async ["login"](iIlIiiil = this.Token) {
    if (/lzdz\d+-isv/.test(this.activityUrl)) {
      await this.lzdz4Login();
    } else {
      if (hdbTypes.includes(this.domain)) {
        let i1lIiIlI = await this.api("/front/fans/login", {
          "source": "01",
          "token": iIlIiiil
        });
        if (i1lIiIlI.code == "200") {
          this.log("登录成功 " + i1lIiIlI.result.grade);
          this.aesBuyerNick = i1lIiIlI.result.aesBuyerNick;
          i1lIiIlI.result.grade < 0 && /partitionTeam/.test(this.activityUrl) && (await this.openCard());
          if (this.index > this.masterNum && i1lIiIlI.result.grade > 0 && /inviteJoin/.test(this.activityUrl)) throw new Error("已经是会员无法助力");
          await this.api("/front/activity/reportPVUV", {
            "source": "01",
            "token": iIlIiiil
          });
          await this.loadFrontAct();
        } else {
          this.putMsg("登录失败");
          throw new Error(i1lIiIlI.message);
        }
      } else {
        let llIIl1li = this.UA.split(";"),
          i1IlI1I1 = llIIl1li[1] == "iPhone" ? true : false,
          lII1il11 = this.UA.match(/iPhone OS (.+?) /) ? this.UA.match(/iPhone OS (.+?) /)[1].replace(/_/g, ".") : "-1",
          iIiIlIi1 = this.uuid(),
          lii11I1l = await this.api("/api/user-info/login", {
            "status": "0",
            "activityId": this.activityId,
            "tokenPin": iIlIiiil,
            "source": "01",
            "shareUserId": "",
            "uuid": iIiIlIi1,
            "client": i1IlI1I1 ? "iOS" : llIIl1li[1],
            "clientVersion": i1IlI1I1 ? llIIl1li[2] : "-1",
            "osVersion": lII1il11,
            "model": i1IlI1I1 ? "iPhone11,8" : "-1",
            "userAgent": this.UA
          });
        if (lii11I1l.resp_code !== 0) {
          this.putMsg("登录失败");
          throw new Error(lii11I1l.message);
        }
        this.isvToken = iIlIiiil;
        this.Token = lii11I1l.data.token;
        try {
          this.venderId = lii11I1l.data.venderId || lii11I1l.data.joinInfo.openCardUrl.split("venderId=")[1].split("&")[0];
        } catch (iiIIIilI) {
          this.venderId = lii11I1l.data.venderId || lii11I1l.data.shopId;
        }
        this.shopId = lii11I1l.data.shopId;
        this.shopName = lii11I1l.data.shopName;
        this.joinCode = lii11I1l.data.joinInfo.joinCodeInfo.joinCode;
        this.joinDes = lii11I1l.data.joinInfo.joinCodeInfo.joinDes;
        this.log("登录成功 " + this.joinCode + " " + this.joinDes);
        let I1iiillI = await this.api("/api/active/basicInfo", {
          "activityId": this.activityId
        });
        this.actStartTime = I1iiillI.data.startTime;
        this.actEndTime = I1iiillI.data.endTime;
        this.actName = I1iiillI.data.actName;
        if (!this.prizeList || this.prizeList.length <= 0) {
          await this.getPrizeList();
        }
        if (this.prizeList && this.prizeList.length > 0 && this.prizeList.filter(IIili => ![2].includes(IIili.prizeType) && IIili.leftNum !== 0).length === 0) {
          this.putMsg("垃圾活动");
          this.expire = true;
        }
        if (this.actStartTime > this.timestamp()) {
          this.putMsg("活动未开始");
          this.expire = true;
          throw new Error("活动未开始");
        }
        if (this.timestamp() > this.actEndTime) {
          this.putMsg("活动已结束");
          this.expire = true;
          throw new Error("活动已结束");
        }
        if (this.expire) throw new Error("垃圾活动");
        this.isMember = ["1001", "1004"].includes(this.joinCode);
        try {
          await this.api("/api/task/followShop/follow", {});
        } catch (I11llli1) {}
        await this.initPinToken();
        if (!this.isMember && openCardTypes.includes(this.activityType)) {
          await this.openCard();
          this.isMember = true;
          return;
        }
        !this.isMember && this.prizeList && this.prizeList.length > 0 && this.prizeList.filter(llii => [1, 3].includes(llii.prizeType) && llii.leftNum !== 0).length > 0 && ["10023", "10024", "10040", "10036", "10068", "10002"].includes(this.activityType) && (await this.openCard(), this.isMember = true);
        if (!this.isMember) {
          this.putMsg("" + this.joinDes);
          throw new Error(this.joinDes);
        }
      }
    }
  }
  async ["getPrizeList"]() {
    let li1ii1lI = await this.api("/api/prize/drawPrize", {});
    if (li1ii1lI.resp_code !== 0) {
      this.log("获取奖品是失败");
      return;
    }
    this.prizeList = li1ii1lI.data?.["prizeInfo"] || [];
  }
  async ["loadFrontAct"]() {
    let IIiIIiI1 = await this.api("/front/activity/loadFrontAct", {});
    if (IIiIIiI1.code == "200") {
      this.actStartTime = IIiIIiI1.result.activity.startTime;
      this.actEndTime = IIiIIiI1.result.activity.endTime;
      this.rule = IIiIIiI1.result.activity.remark;
      this.shopName = IIiIIiI1.result.activity.shopTitle;
      this.useGrade = IIiIIiI1.result.activity.useGrade;
      this.shopId = IIiIIiI1.result.user.shopId;
      this.venderId = IIiIIiI1.result.user.venderId;
      this.memberStatus = IIiIIiI1.result.user.memberStatus;
      this.actName = IIiIIiI1.result.activity.actName;
      if (this.actStartTime > this.timestamp()) {
        this.putMsg("活动未开始");
        this.expire = true;
        throw new Error("活动未开始");
      }
      if (this.actEndTime < this.timestamp()) {
        this.putMsg("活动已结束");
        this.expire = true;
        throw new Error("活动已结束");
      }
      if (IIiIIiI1.result.activity.isNeedFavourite && !IIiIIiI1.result.isFavouriteShop) {
        await this.reportActionLog({
          "actionType": "favouriteShop"
        });
      }
    } else {
      this.putMsg("loadFrontAct失败");
      throw new Error(IIiIIiI1.message);
    }
    if (!this.prizeList || this.prizeList.length <= 0) {
      let lil11Il = await this.api("/front/activity/loadFrontAward", {});
      if (lil11Il.succ) {
        this.prizeList = lil11Il.result || [];
        this.activity = IIiIIiI1.result;
        if (this.prizeList && this.prizeList.length > 0 && this.prizeList.filter(illiiili => !["JD_D_COUPON"].includes(illiiili.awardType)).length === 0) {
          this.expire = true;
          this.putMsg("垃圾活动");
          throw new Error("垃圾活动");
        }
      }
    }
  }
  async ["reportActionLog"](IIiii1I) {
    await this.wait(3000, 5000);
    let Ilil111I = await this.api("/front/activity/reportActionLog", IIiii1I);
    Ilil111I.code == "200" ? this.log(IIiii1I?.["actionType"] + "操作成功") : this.putMsg(Ilil111I.message);
  }
  ["v"](ilii1iII) {
    let iI1I111i = ["B6dB3QqGZP1lKNICTaiAeNJSHKNepO5GGgtL6FUceqSlpFZCdx2SZ5MPPbzrgy91HeR0dnJazcMrvMgPF7bhFrfsGaApJKk4JohEEhoJ4kKJpAaGsfrFhb7FPgMvrMczaJnd0ReH19ygrzbPPM5ZS2xdCZFplSqecUF6LtgGG5OpeNKHSJNeAiaTCINKl1PZGqQ3Bd6B", "EUhzJoyKP7VydtpyBwNUGU2tqzI0QB0LIpQ10Fk3hX2ZcPoGRpACqmzcTQbKd98i3U7raFz2rMl2kys0ODgtAh22E3i57wmh38RbbR83hmw75i3E22hAtgDO0syk2lMr2zFar7U3i89dKbQTczmqCApRGoPcZ2Xh3kF01QpIL0BQ0Izqt2UGUNwByptdyV7PKyoJzhUE", "xexcHoyVwOs5TYTQVvU0iXn56ryKVdWedLTpq3KEKmbUHfwzuZjIpZOPVXMEappFhjdqwtp1bBrWaRBCfPFwCq2W8SsyvwqZ6sIGGIs6ZqwvysS8W2qCwFPfCBRaWrBb1ptwqdjhFppaEMXVPOZpIjZuzwfHUbmKEK3qpTLdeWdVKyr65nXi0UvVQTYT5sOwVyoHcxex", "2Llnegc5i4flqd4HZPFK210yh61boBxRSdnNVMeudKimx92Qi4aPuHP12HmEImbWrXjLgBGqy1bSnKvLhqMqhknyuse4nFoeLTkJJkTLeoFn4esuynkhqMqhLvKnSb1yqGBgLjXrWbmIEmH21PHuPa4iQ29xmiKdueMVNndSRxBob16hy012KFPZH4dqlf4i5cgenlL2", "dZzoMZF6xtt3voTFDbPzEZ7GeM8t7uY05d4K4xfhtdxELh96dDRB4oRYA2smET5dy1dafGkXOz2V7tNOVi0vSqfuhI99IKprVK6QQ6KVrpKI99IhufqSv0iVONt7V2zOXkGfad1yd5TEms2AYRo4BRDd69hLExdthfx4K4d50Yu7t8MeG7ZEzPbDFTov3ttx6FZMozZd", "SNYr3bWMtQulWZO2FEwuhSFp3EXPR1TujPRJwUFlxBh9Pvf2MeTEpR7a3dU6e9rNUMyBh2osDdK4Vdm4gZ0XcRCoHZPi2jiXT2dCCd2TXij2iPZHoCRcX0Zg4mdV4KdDso2hByMUNr9e6Ud3a7RpETeM2fvP9hBxlFUwJRPjuT1RPXE3pFShuwEF2OZWluQtMWb3rYNS", "4viQ2FrYHcrH44gqvPLo6KtiFu56AW1eXbDBZrBepzdLKE33Ey4TwFERnkVLnbHAXbKqAi0HFP9Eu7yg8WNlI7q2dvXGGiPaMbrBBrbMaPiGGXvd2q7IlNW8gy7uE9PFH0iAqKbXAHbnLVknREFwT4yE33EKLdzpeBrZBDbXe1WA65uFitK6oLPvqg44HrcHYrF2Qiv4", "0VIoSHBNVAW8De7NquFyEUm0o9xNnQJGn2OR1yOK9djWALhyP3a1XoQEwTnXuzypRuwsaLPUlertksOY6LYmnbQmPgdDQRXXKdKooKdKXXRQDdgPmQbnmYL6YOsktrelUPLaswuRpyzuXnTwEQoX1a3PyhLAWjd9KOy1RO2nGJQnNx9o0mUEyFuqN7eD8WAVNBHSoIV0", "fdJPBiTra9E0qg2HJrobeEC2SkOfSzbw6nG5J5ACx42GQDBsCyGfxNlHHYhl7EmkdvYaKAXUVXSKcTT1KhyYaj9Q4YtyhnOA7cLrrLc7AOnhytY4Q9jaYyhK1TTcKSXVUXAKaYvdkmE7lhYHHlNxfGyCsBDQG24xCA5J5Gn6wbzSfOkS2CEeborJH2gq0E9arTiBPJdf", "kLOA93PyUOX3QdlLuZ9JgNq1peyIITAQSnKzuLBZ2NthOSseAJMGCecvSLVKAww61Y31hJ4l7kAOcjLmtqQNJlNyJb5yu9d9vqWUUWqv9d9uy5bJyNlJNQqtmLjcOAk7l4Jh13Y16wwAKVLSvceCGMJAesSOhtN2ZBLuzKnSQATIIyep1qNgJ9ZuLldQ3XOUyP39AOLk"];
    var li1I1i1l = ilii1iII.nowTime + parseInt(this.tickets.get("te"));
    ilii1iII.nowTime = li1I1i1l;
    debugger;
    for (var lI11III = this.tickets.get("pToken") + li1I1i1l, i1l1lIIi = lI11III.substring(0, lI11III.length - 5), liIiiIil = "", iiiil111 = 0; iiiil111 < i1l1lIIi.length; iiiil111++) {
      var IIIilll = i1l1lIIi.charCodeAt(iiiil111);
      liIiiIil += iI1I111i[IIIilll % 10][iiiil111];
    }
    for (var l1IIilli = liIiiIil.length, l1iIiIll = Math.floor(l1IIilli / 24), l1lIi11I = "", IiIi1111 = 0; IiIi1111 < 24; IiIi1111++) {
      var ii11Il1 = (IiIi1111 + 1) * l1iIiIll;
      23 === IiIi1111 && (ii11Il1 = l1IIilli);
      for (var IlillIII = liIiiIil.substring(IiIi1111 * l1iIiIll, ii11Il1), I1l1II1l = [], IllIil11 = 0; IllIil11 < IlillIII.length; IllIil11++) {
        I1l1II1l.push(IlillIII.charCodeAt(IllIil11));
      }
      var l1II1lil = I1l1II1l.reduce(function (l1lI1lIl, Iiil111i) {
          return l1lI1lIl + Iiil111i;
        }, 0),
        iiil1IIi = Math.floor(l1II1lil / I1l1II1l.length);
      l1lIi11I += String.fromCharCode(iiil1IIi);
    }
    var li111l1I = function (lIillIii) {
        lIillIii = lIillIii.split("").reverse().join("");
        for (var i11liI1 = new Uint8Array(12), IIlIIIlI = new TextEncoder().encode(lIillIii), II11Iil1 = 0; II11Iil1 < IIlIIIlI.length; II11Iil1 += 2) {
          var i1iliIl1 = IIlIIIlI[II11Iil1] << 5 | 255 & IIlIIIlI[II11Iil1 + 1];
          i1iliIl1 %= 63;
          i11liI1[II11Iil1 >> 1] = i1iliIl1;
        }
        for (var Ili1iiII = "", illIlli1 = 0; illIlli1 < i11liI1.length; illIlli1++) {
          Ili1iiII += (i11liI1[illIlli1] + 256).toString(2).slice(1);
        }
        for (var ili1il1 = "", Iiil1II = "", i1I1liI = 0; i1I1liI < 16; i1I1liI++) {
          if (0 !== i1I1liI) {
            for (var iiliIiII = 6 * i1I1liI, i1lIIl = Ili1iiII.substring(iiliIiII, iiliIiII + 6), i11l11ii = parseInt(i1lIIl, 2), ii111iIi = Iiil1II.split(""), lIl11Iil = 0; lIl11Iil < ii111iIi.length; lIl11Iil++) {
              "1" === ii111iIi[lIl11Iil] && (i11l11ii = 63 & (i11l11ii >> 6 - lIl11Iil | i11l11ii << lIl11Iil));
            }
            Iiil1II = (63 & i11l11ii).toString(2).padStart(6, "0");
          } else Iiil1II = Ili1iiII.substring(0, 6);
          ili1il1 += Iiil1II;
        }
        for (var i1l1i1Ii = 0; i1l1i1Ii < 12; i1l1i1Ii++) {
          var li1iIlli = 8 * i1l1i1Ii;
          i11liI1[i1l1i1Ii] = parseInt(ili1il1.substring(li1iIlli, li1iIlli + 8), 2);
        }
        return base64.encode(String.fromCharCode.apply(null, i11liI1));
      }(liIiiIil = l1lIi11I),
      I1l111 = CryptoJS.enc.Utf8.parse(li111l1I),
      lll11ll = CryptoJS.enc.Utf8.parse("");
    return CryptoJS.AES.encrypt(JSON.stringify(ilii1iII), I1l111, {
      "iv": lll11ll,
      "mode": CryptoJS.mode.ECB,
      "padding": CryptoJS.pad.Pkcs7
    }).toString();
  }
  async ["api"](i1IlillI, lIiIl1l, ill111li = this.Token, i1I1IIIl = this.ticket, l11111I1 = 0) {
    let IiillIli = lIiIl1l;
    try {
      i1IlillI = ("/" + i1IlillI).replace("//", "/");
      this.urlPrefix = this.urlPrefix ? ("/" + this.urlPrefix).replace("//", "/") : "";
      let IIIllIil = "https://" + this.domain + this.urlPrefix + i1IlillI,
        li1IIlIi = {
          "Host": this.domain,
          "Accept": "application/json, text/plain, text/javascript, */*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "zh-cn",
          "Connection": "keep-alive",
          "Content-Type": lIiIl1l ? typeof lIiIl1l == "string" ? "application/x-www-form-urlencoded;charset=utf-8" : "application/json;charset=utf-8" : "application/x-www-form-urlencoded;charset=utf-8",
          "Origin": "https://" + this.domain,
          "Cookie": this.activityUrl.match(new RegExp(["prod/cc", "interact", "crm-proya", ...hdbTypes, ...jinggengcjTypes].join("|"))) ? "" : "IsvToken=" + ill111li + ";" + i1I1IIIl,
          "Referer": this.activityUrl + "&sid=" + this.randomString() + "&un_area=" + this.randomPattern("xx_xxxx_xxxx_xxxxx"),
          "User-Agent": this.UA
        };
      ill111li?.["startsWith"]("ey") && (li1IIlIi.token = ill111li);
      hdbTypes.includes(this.domain) && (lIiIl1l = this.hdbBody(i1IlillI, lIiIl1l, li1IIlIi));
      jinggengcjTypes.includes(this.domain) && (lIiIl1l = this.jinggengjcqBody(i1IlillI, lIiIl1l));
      if (this.defenseUrls && this.defenseUrls.includes(i1IlillI)) {
        if (this.activityUrl.includes("interactsaas")) lIiIl1l.nowTime = this.timestamp(), lIiIl1l.actId = this.activityId, lIiIl1l.consumePoints = lIiIl1l.consumePoints || 0;else {
          const I1l1I1 = new URLSearchParams(lIiIl1l);
          lIiIl1l = {};
          for (const [I1iI11Il, i1ii1IIl] of I1l1I1.entries()) {
            lIiIl1l[I1iI11Il] = i1ii1IIl;
          }
          lIiIl1l.nowTime = this.timestamp();
          lIiIl1l.actId = this.activityId;
          debugger;
        }
        li1IIlIi.Cookie = "IsvToken=" + this.isvToken + ";" + this.ticket + "isBasicJson=true;";
        let IIiIiIl1 = this.v(lIiIl1l);
        lIiIl1l = {
          "ecyText": IIiIiIl1
        };
      }
      if (/lzdz\d+-isv/.test(this.activityUrl)) for (let l1ilIlI of Object.keys(this.tickets)) {
        li1IIlIi[l1ilIlI.replace("_", "").toLowerCase()] = this.tickets.get(l1ilIlI);
      }
      let {
        data: l1Iiiii1
      } = await this.request(IIIllIil, li1IIlIi, lIiIl1l);
      if (this.defenseUrls && this.defenseUrls.includes(i1IlillI) && (!l1Iiiii1 || l1Iiiii1.length === 0) && l11111I1 < 5) return await this.initPinToken(), await this.api(i1IlillI, IiillIli, ill111li, i1I1IIIl, ++l11111I1);
      if (!l1Iiiii1) {
        return l1Iiiii1;
      }
      let I1IIiil1 = JSON.stringify(l1Iiiii1);
      if (/还是去买买买吧/.test(I1IIiil1)) {
        this.putMsg("火爆账号[" + this.username + "]");
        throw new Error("还是去买买买吧");
      }
      if (I1IIiil1?.["includes"]("AUTH.FAILED.BLACK")) {
        return this.putMsg("AUTH BLACK"), l1Iiiii1;
      }
      if (I1IIiil1?.["includes"]("请稍后重试") && jinggengcjTypes.includes(this.domain)) return l1Iiiii1;
      if (new RegExp(reTryRegx).test(I1IIiil1) && l11111I1 < 5) {
        return this.log("重试" + l11111I1), await this.api(i1IlillI, IiillIli, ill111li, i1I1IIIl, ++l11111I1);
      }
      if ((I1IIiil1.includes("您点的太快了") || I1IIiil1.includes("操作过于频繁")) && l11111I1 < 5) return this.log("重试" + l11111I1), await this.wait(3000, 5000), await this.api(i1IlillI, IiillIli, ill111li, i1I1IIIl, ++l11111I1);
      if (I1IIiil1.includes("请求的数字签名不匹配")) return this.log("签名错误"), await this.login(this.isvToken), await this.api(i1IlillI, IiillIli, ill111li, i1I1IIIl, ++l11111I1);
      if (I1IIiil1.includes("会员等级不")) {
        if (ill111li?.["startsWith"]("ey") && l11111I1 < 3) {
          return this.log("等级不足重试" + l11111I1), await this.login(this.isvToken), await this.wait(3000, 5000), await this.api(i1IlillI, IiillIli, this.Token, i1I1IIIl, ++l11111I1);
        } else {
          this.putMsg("等级不足");
          throw new Error("等级不足");
        }
      }
      return (I1IIiil1.includes("商家token过期") || I1IIiil1.includes("商家订购过期")) && (this.putMsg("商家token过期"), this.expire = true), l1Iiiii1;
    } catch (iI111iil) {
      if (l11111I1 > 3) {
        throw new Error(iI111iil.message);
      }
      if (this.defenseUrls && this.defenseUrls.includes(i1IlillI) && [500].includes(iI111iil.response?.["status"])) return this.log("重试"), await this.initPinToken(), await this.api(i1IlillI, IiillIli, ill111li, i1I1IIIl, ++l11111I1);
      if (this.isProxy(iI111iil.message)) return await this.routerProxy(l11111I1), await this.api(i1IlillI, IiillIli, ill111li, i1I1IIIl, ++l11111I1);else {
        throw new Error(iI111iil.message);
      }
    }
  }
  ["jinggengjcqBody"](il1ii1II, II11I1Il) {
    let il1lll1 = il1ii1II.match(/dm\/front(.+)\?/)[1];
    delete II11I1Il.method;
    let liiiI1II = {
        "actId": this.activityId,
        ...II11I1Il,
        "method": il1lll1,
        "userId": this.userId,
        "buyerNick": this.buyerNick || ""
      },
      lliIIi1 = this.mpdzSign(liiiI1II),
      ii1lIl1i = "94854284";
    const lilIIliI = {
      "jsonRpc": "2.0",
      "params": {
        "commonParameter": {
          "appkey": ii1lIl1i,
          "m": "POST",
          "oba": lliIIi1.sign,
          "timestamp": lliIIi1.timeStamp,
          "userId": this.userId
        },
        "admJson": {
          "actId": this.activityId,
          ...II11I1Il,
          "method": il1lll1,
          "userId": this.userId,
          "buyerNick": this.buyerNick || ""
        }
      }
    };
    return il1lll1?.["indexOf"]("missionInviteList") > -1 && delete lilIIliI.params.admJson.actId, JSON.stringify(lilIIliI);
  }
  ["mpdzSign"](I1i1lilI) {
    let IlIiii1i = "6cc5dbd8900e434b94c4bdb0c16348ed",
      lliil1I1 = "c1614da9ac68",
      llIi11i = new Date().valueOf(),
      i1l1I1 = encodeURIComponent(JSON.stringify(I1i1lilI)),
      lI1III1I = new RegExp("'", "g"),
      l111I1l = new RegExp("~", "g");
    i1l1I1 = i1l1I1.replace(lI1III1I, "%27");
    i1l1I1 = i1l1I1.replace(l111I1l, "%7E");
    let i1I1il1l = "f" + lliil1I1 + "D" + i1l1I1 + "c" + llIi11i + IlIiii1i,
      iIill1i = CryptoJS.MD5(i1I1il1l.toLowerCase()).toString();
    return {
      "sign": iIill1i,
      "timeStamp": llIi11i
    };
  }
  ["hdbBody"](Iiil1l11, I1iIII1I, I11I11ll) {
    let i1I111lI = this.aesBuyerNick,
      iIlI11iI = Date.now(),
      IIi1lII1 = {
        "appJsonParams": {
          "id": this.activityId,
          "userId": this.venderId,
          "shopId": this.shopId || this.venderId,
          ...I1iIII1I,
          "buyerNick": i1I111lI,
          "method": Iiil1l11
        },
        "sysParams": {
          "sysmethod": JSON.stringify(Iiil1l11).replace(/[^\u4e00-\u9fa5\w]/g, ""),
          "timestamp": iIlI11iI,
          "actid": this.activityId
        }
      };
    I1iIII1I && (I1iIII1I = IIi1lII1);
    !i1I111lI && (delete I1iIII1I.appJsonParams.buyerNick, delete I1iIII1I.sysParams.buyernick);
    this.tickets.get("_sk") ? I11I11ll._sk = this.tickets.get("_sk") : "";
    this.tickets.get("zxhd_aes_buyer_nick") ? I11I11ll._dzf = this.tickets.get("zxhd_aes_buyer_nick") : "";
    let iiIlilli = "actid" + this.activityId + "buyernick" + (i1I111lI || "undefined") + "sysmethod" + JSON.stringify(Iiil1l11).replace(/[^\u4e00-\u9fa5\w]/g, "") + "timestamp" + iIlI11iI,
      IiIill1i = I11I11ll._sk || "1111";
    return I1iIII1I.sysParams.sign = CryptoJS.HmacSHA256(iiIlilli, IiIill1i).toString(CryptoJS.enc.Hex), I1iIII1I;
  }
  async ["selectAddress"](IlI1II1l) {
    let iilI11Ii,
      i1i1l1i = M_WX_ADDRESS_MODE.toUpperCase();
    this.log("当前填地址模式: " + M_WX_ADDRESS_MODE.toUpperCase());
    ["PIN"].includes(i1i1l1i) && (iilI11Ii = this.accounts[IlI1II1l]?.["address"] || this.accounts[encodeURIComponent(IlI1II1l)]?.["address"]);
    if (iilI11Ii) return iilI11Ii;
    ["CC", "CCWAV"].includes(i1i1l1i) && (iilI11Ii = this.accounts["默认地址" + this.addressIndex]?.["address"]);
    if (iilI11Ii) return iilI11Ii;
    let Iil11IiI = [];
    for (let Il1illI in this.accounts) {
      if (this.accounts[Il1illI]?.["address"]) {
        Iil11IiI.push(this.accounts[Il1illI].address);
      }
    }
    if (["RANGE"].includes(i1i1l1i)) {
      let l11il1ll = Math.min(parseInt(M_WX_ADDRESS_RANGE?.["split"]("-")?.[1] || Iil11IiI.length), Iil11IiI.length);
      this.addressIndex > l11il1ll && (this.addressIndex = 1);
      iilI11Ii = Iil11IiI[this.addressIndex - 1];
    }
    if (iilI11Ii) return iilI11Ii;
    if (M_WX_ADDRESS_MODE_LOWER || ["RANDOM"].includes(i1i1l1i)) {
      debugger;
      return Iil11IiI[this.random(1, Iil11IiI.length) - 1];
    }
  }
  async ["saveAddress"](i1iIi1ii = this.addressId, Illl1III = this.prizeName, IlIIlIil = this.Pin, llilIIIi = this.username, iIIIllI = "") {
    if (await this.wxAddressStop(Illl1III)) {
      this.putMsg("命中关键词，不填写地址！");
      return;
    }
    if (await this.wxAddressStopRule()) {
      this.putMsg("命中规则，不填地址beta！");
      return;
    }
    this.currAddrUsername && this.currAddrUsername !== llilIIIi && this.addressIndex++;
    this.currAddrUsername = llilIIIi;
    let IiiIIIlI = await this.selectAddress(llilIIIi);
    if (!IiiIIIlI) {
      this.putMsg("没有找到地址信息");
      return;
    }
    (M_WX_ADDRESS_LOG || mode) && this.log("当前地址详情" + JSON.stringify(IiiIIIlI));
    let Ii1l1iI1 = this.shopName;
    if (!Ii1l1iI1) try {
      Ii1l1iI1 = await this.getShopName();
    } catch (IIIlIllI) {
      console.log("addr" + IIIlIllI);
    }
    try {
      if (jinggengcjTypes.includes(this.domain)) {
        let iiiIl = await this.api("/dm/front/jdBigAlliance/awards/updateAddress?open_id=&mix_nick=" + (this.buyerNick || "") + "&user_id=10299171", {
          "receiverName": IiiIIIlI.receiver,
          "receiverMobile": IiiIIIlI.phone,
          "receiverProvince": IiiIIIlI.province,
          "receiverCity": IiiIIIlI.city,
          "receiverDistrict": IiiIIIlI.county,
          "receiverAddress": IiiIIIlI.address,
          "logId": i1iIi1ii
        });
        console.log(iiiIl);
      } else {
        if (this.domain.includes("jinggeng")) {
          let il1i1llI = IiiIIIlI.province.replace("市", "").replace("省", "") + " " + IiiIIIlI.city.replace("市", "") + " " + IiiIIIlI.county + IiiIIIlI.address,
            IliillIi = await this.api("/ql/front/postBuyerInfo", "receiverName=" + encodeURIComponent(IiiIIIlI.receiver) + "&mobile=" + IiiIIIlI.phone + "&address=" + encodeURIComponent(il1i1llI) + "&log_id=" + i1iIi1ii + "&user_id=" + this.userId);
          console.log(IliillIi);
          if (IliillIi.succ) this.putMsg("已填地址"), await fs.appendFileSync("gifts.csv", this.now() + "," + Illl1III + "," + llilIIIi + "," + IiiIIIlI.phone + "," + IiiIIIlI.address + "," + this.name + "," + Ii1l1iI1 + "," + this.activityUrl + "\n");else {
            this.putMsg(IliillIi.msg);
          }
        } else {
          if (this.activityUrl.includes("interact") || this.activityUrl.includes("prod/cc") || this.activityUrl.includes("crm-proya")) {
            let i1IllIi = await this.api("/api/my/prize/update", {
              "realName": IiiIIIlI.receiver,
              "mobile": IiiIIIlI.phone,
              "address": IiiIIIlI.address,
              "orderCode": this.addressId,
              "province": IiiIIIlI.province,
              "city": IiiIIIlI.city,
              "county": IiiIIIlI.county
            });
            console.log(i1IllIi);
            i1IllIi?.["data"] !== "2" ? (this.putMsg("已填地址"), await fs.appendFileSync("gifts.csv", this.now() + "," + Illl1III + "," + llilIIIi + "," + IiiIIIlI.phone + "," + IiiIIIlI.address + "," + this.name + "," + Ii1l1iI1 + "," + this.activityUrl + "\n")) : this.putMsg("超一小时或其他报错，请手动进活动确认");
          } else {
            let lilIi1II = await this.api("wxAddress/save", "venderId=" + this.venderId + "&pin=" + IlIIlIil + "&activityId=" + this.activityId + "&actType=" + this.activityType + "&prizeName=" + encodeURIComponent(Illl1III) + "&receiver=" + encodeURIComponent(IiiIIIlI.receiver) + "&phone=" + IiiIIIlI.phone + "&province=" + encodeURIComponent(IiiIIIlI.province) + "&city=" + encodeURIComponent(IiiIIIlI.city) + "&address=" + encodeURIComponent(IiiIIIlI.address) + "&generateId=" + i1iIi1ii + "&postalCode=" + IiiIIIlI.postalCode + "&areaCode=" + encodeURIComponent(IiiIIIlI.areaCode) + "&county=" + encodeURIComponent(IiiIIIlI.county));
            if (!lilIi1II?.["result"]) {
              if (lilIi1II.errorMessage.includes("您必须在中奖一小时内填写中奖地址")) {
                return;
              }
            }
            lilIi1II?.["result"] ? (this.putMsg("已填地址"), await fs.appendFileSync("gifts.csv", this.now() + "," + Illl1III + "," + llilIIIi + "," + IiiIIIlI.phone + "," + IiiIIIlI.address + "," + this.name + "," + Ii1l1iI1 + "," + this.activityUrl + "\n")) : (lilIi1II = await this.api("wxAddress/save", "venderId=" + this.shopId + "&pin=" + IlIIlIil + "&activityId=" + this.activityId + "&actType=" + this.activityType + "&prizeName=" + encodeURIComponent(Illl1III) + "&receiver=" + encodeURIComponent(IiiIIIlI.receiver) + "&phone=" + IiiIIIlI.phone + "&province=" + encodeURIComponent(IiiIIIlI.province) + "&city=" + encodeURIComponent(IiiIIIlI.city) + "&address=" + encodeURIComponent(IiiIIIlI.address) + "&generateId=" + i1iIi1ii + "&postalCode=" + IiiIIIlI.postalCode + "&areaCode=" + encodeURIComponent(IiiIIIlI.areaCode) + "&county=" + encodeURIComponent(IiiIIIlI.county)), lilIi1II?.["result"] ? (this.putMsg("已填地址"), await fs.appendFileSync("gifts.csv", this.now() + "," + Illl1III + "," + llilIIIi + "," + IiiIIIlI.phone + "," + IiiIIIlI.address + "," + this.name + "," + Ii1l1iI1 + "," + this.activityUrl + "\n")) : this.putMsg("" + lilIi1II?.["errorMessage"]));
          }
        }
      }
    } catch (iiIIiI1I) {
      console.log(iiIIiI1I);
    }
  }
  async ["carData"]() {
    let i1lIIIl = "https://wq.jd.com/deal/mshopcart/uncheckcmdy?sceneval=2&g_login_type=1&g_ty=ajax",
      II1I1Ii1 = "commlist=&pingouchannel=0&all=1&scene=0&locationid=&type=0&templete=1&reg=1&version=20190418&traceid=&tabMenuType=4&sceneval=2",
      i1lIl1i = {
        "Accept": "application/json",
        "Origin": "https://p.m.jd.com",
        "Cookie": this.cookie,
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "wq.jd.com",
        "User-Agent": "jdpingou;5.5.2;;session/9;brand/apple",
        "Referer": "https://p.m.jd.com/",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9"
      },
      {
        data: iiiliIli
      } = await this.request(i1lIIIl, i1lIl1i, II1I1Ii1);
    return iiiliIli.errId === "0" ? iiiliIli : "";
  }
  async ["carRmv"](iiIiili = []) {
    let l1lI11iI = [],
      I1Iil1ll = await this.carData();
    if (I1Iil1ll) {
      for (let iIIIIil of I1Iil1ll.cart.venderCart) {
        for (let l1I1il of iIIIIil.sortedItems) {
          for (let Il11II1I of l1I1il.polyItem.products) {
            if (iiIiili.length > 0 && iiIiili.includes(Il11II1I.mainSku.id.toString()) || iiIiili.length === 0) {
              const IiIIi11I = l1I1il.polyItem?.["promotion"]?.["pid"];
              if (IiIIi11I) l1lI11iI.push(Il11II1I.mainSku.id + ",,1," + Il11II1I.mainSku.id + ",11," + l1I1il.polyItem.promotion.pid + ",0,skuUuid:" + Il11II1I.skuUuid + "@@useUuid:0");else {
                l1lI11iI.push(Il11II1I.mainSku.id + ",,1," + Il11II1I.mainSku.id + ",1,,0,skuUuid:" + Il11II1I.skuUuid + "@@useUuid:0");
              }
            }
          }
        }
      }
    }
    if (l1lI11iI.length === 0) return;
    this.log("即将删除" + l1lI11iI.length + "件商品");
    let iIlI1lI1 = "https://wq.jd.com/deal/mshopcart/rmvCmdy?sceneval=2&g_login_type=1&g_ty=ajax",
      llIIi1ll = "pingouchannel=0&commlist=" + encodeURIComponent(l1lI11iI.join("$")) + "&type=0&checked=0&locationid=&templete=1&reg=1&scene=0&version=20190418&traceid=&tabMenuType=4&sceneval=2",
      lllilIll = {
        "Accept": "application/json",
        "Origin": "https://p.m.jd.com",
        "Cookie": this.cookie,
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "wq.jd.com",
        "User-Agent": "jdpingou;5.5.2;;session/9;brand/apple",
        "Referer": "https://p.m.jd.com/",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9"
      },
      {
        data: i1i1l11I
      } = await this.request(iIlI1lI1, lllilIll, llIIi1ll);
    return i1i1l11I.errId === "0" ? i1i1l11I : {};
  }
  async ["openCardInfo"](iIi1l1l1 = this.venderId, IiiI1Il1 = this.cookie, llI1IlIl = 0) {
    try {
      if (openCardMode.includes("wh5")) {
        let lIlIiiI = {
            "venderId": iIi1l1l1,
            "payUpShop": true,
            "channel": 406
          },
          iil1Ili = "https://api.m.jd.com/getShopOpenCardInfo?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=" + encodeURIComponent(JSON.stringify(lIlIiiI)) + "&uuid=88888&clientVersion=9.2.0&client=wh5&" + (await this.h5st());
        return await this.get(iil1Ili, {
          "authority": "api.m.jd.com",
          "accept": "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/x-www-form-urlencoded",
          "origin": "https://shopmember.m.jd.com",
          "referer": "https://shopmember.m.jd.com/",
          "user-agent": this.UA,
          "Cookie": this.cookie
        });
      } else {
        let Ii11iI1 = "https://api.m.jd.com/client.action?appid=jd_shop_member&" + (await this.h5st({
          "venderId": iIi1l1l1,
          "channel": 401
        }, "getShopOpenCardInfo"));
        return await this.get(Ii11iI1, {
          "Accept": "*/*",
          "Connection": "close",
          "Referer": "https://shopmember.m.jd.com/shopcard/?",
          "Accept-Encoding": "gzip, deflate, br",
          "Host": "api.m.jd.com",
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
          "Accept-Language": "zh-cn",
          "Cookie": IiiI1Il1
        });
      }
    } catch (II1il1i1) {
      this.log(II1il1i1.message);
      if (llI1IlIl < 3 && II1il1i1.message.includes("status code 403")) {
        return this.isProxy(II1il1i1.message) ? (await this.routerProxy(llI1IlIl), await this.wait(1000, 2000)) : await this.router(), await this.openCardInfo(iIi1l1l1, IiiI1Il1, ++llI1IlIl);
      }
      return {};
    }
  }
  async ["isOpenCard"](IillIii1 = this.venderId, IIll1IlI = this.cookie, ilii1IlI = 0) {
    try {
      let II1ii1l1 = "https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo",
        liIli1I1 = {
          "venderId": IillIii1
        },
        I111I1Il = "body=" + encodeURIComponent(JSON.stringify(liIli1I1)) + "&uuid=2be5d035ec2c47e682c883a13e02cdb6&client=apple&clientVersion=9.4.0",
        {
          data: IiiIili1
        } = await this.request(II1ii1l1, {
          "Host": "api.m.jd.com",
          "User-Agent": "User-Agent: JD4iPhone/167814 (iPhone; iOS 14.4; Scale/3.00)",
          "Content-Type": "application/x-www-form-urlencoded",
          "Origin": "https://api.m.jd.com",
          "Cookie": IIll1IlI
        }, I111I1Il);
      if (IiiIili1?.["result"]?.["userInfo"]?.["openCardStatus"] === 1) {
        this.log(IillIii1 + " 已经是会员");
      }
      return await this.wait(1000), IiiIili1?.["result"]?.["userInfo"]?.["openCardStatus"] === 1;
    } catch (I1iIlI1I) {
      this.log(I1iIlI1I.message);
      if (ilii1IlI < 3 && I1iIlI1I.message.includes("status code 403")) {
        return this.isProxy(I1iIlI1I.message) ? (await this.routerProxy(ilii1IlI), await this.wait(1000, 2000)) : await this.router(), await this.isOpenCard(IillIii1, IIll1IlI, ++ilii1IlI);
      }
      return false;
    }
  }
  async ["openCard"](Ii11II1I = this.venderId, I1lIi1lI = 406, Ii11Iii = "", lII11IIi = 0) {
    try {
      if (lII11IIi > 3) {
        return;
      }
      let lIli1ll = {
        "venderId": Ii11II1I,
        "shopId": this.shopId || Ii11II1I,
        "bindByVerifyCodeFlag": 1,
        "registerExtend": {},
        "writeChildFlag": 0,
        "channel": I1lIi1lI
      };
      if (Ii11Iii) {
        Object.assign(lIli1ll, {
          "activityId": Ii11Iii
        });
      }
      let i1lill = "https://api.m.jd.com/client.action",
        i111iil1 = {
          "authority": "api.m.jd.com",
          "accept": "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
          "content-type": "application/x-www-form-urlencoded",
          "origin": "https://shopmember.m.jd.com",
          "referer": "https://shopmember.m.jd.com/",
          "user-agent": this.UA,
          "Cookie": this.cookie
        };
      this.openCount++;
      lIli1ll = "appid=shopmember_m_jd_com&functionId=bindWithVender&body=" + encodeURIComponent(JSON.stringify(lIli1ll)) + "&client=H5&clientVersion=9.2.0&" + (await this.h5st());
      let lI11I1lI = await this.post(i1lill, lIli1ll, i111iil1);
      this.log("开卡结果:" + lI11I1lI?.["message"]);
      if ([0, 9003].includes(lI11I1lI?.["busiCode"] * 1)) return lI11I1lI;
      if ([508, 510, 201, 9002].includes(lI11I1lI?.["busiCode"] * 1)) throw new Error(lI11I1lI?.["message"]);
      if ((lI11I1lI?.["message"]?.["includes"]("火爆") || lI11I1lI?.["message"]?.["includes"]("失败")) && lII11IIi < 3) return await this.openCard(Ii11II1I, I1lIi1lI, Ii11Iii, ++lII11IIi);
      return lI11I1lI;
    } catch (IiIlilll) {
      ++lII11IIi;
      if (lII11IIi < 3 && IiIlilll.message.includes("status code 403")) {
        if (this.isProxy(IiIlilll.message)) await this.routerProxy(lII11IIi), await this.wait(1000, 2000);else {
          await this.router();
        }
        return await this.openCard(Ii11II1I, I1lIi1lI, Ii11Iii, lII11IIi);
      } else throw new Error(IiIlilll?.["message"]);
    }
  }
  async ["getShopMemberInfo"](il1llll1 = this.cookie, I1l1I1lI = this.shopId, Il1IllI = this.venderId) {
    try {
      let Ii1l11II = await this.sign("getFansFuseMemberDetail", {
          "shopId": I1l1I1lI,
          "venderId": Il1IllI,
          "channel": 102,
          "queryVersion": "10.5.2"
        }),
        ii1i11ll = {
          "J-E-H": "",
          "Connection": "keep-alive",
          "Accept-Encoding": "gzip, deflate, br",
          "Content-Type": "application/x-www-form-urlencoded",
          "Host": "api.m.jd.com",
          "Referer": "",
          "J-E-C": "",
          "Accept-Language": "zh-Hans-CN;q=1, en-CN;q=0.9",
          "Accept": "*/*",
          "User-Agent": "JD4iPhone/167841 (iPhone; iOS; Scale/3.00)",
          "Cookie": il1llll1
        },
        illIIlii = "https://api.m.jd.com/client.action?functionId=" + Ii1l11II.fn,
        {
          status: IIl1li1I,
          data: i1lllil
        } = await this.request(illIIlii, ii1i11ll, Ii1l11II.sign);
      return i1lllil.data[0].memberInfo;
    } catch (ilii11i1) {
      return console.log(ilii11i1), {};
    }
  }
  async ["h5st"](I1IllIIi, iIl1111I = "bindWithVender", l11IlIii = 0) {
    return h5sts.random();
  }
  ["getAwardText"](l1IiIlI1) {
    let lli11ii = "";
    if (l1IiIlI1.awardType == "JD_GOODS") lli11ii = l1IiIlI1.awardName + " " + l1IiIlI1.awardDenomination * 1 + "元";else {
      if (l1IiIlI1.awardType == "JD_POINT") lli11ii = l1IiIlI1.awardDenomination * 1 + "积分";else {
        if (l1IiIlI1.awardType == "JD_COUPON" || l1IiIlI1.awardType == "JD_D_COUPON") {
          lli11ii = l1IiIlI1.awardDenomination * 1 + "元券";
        } else {
          if (l1IiIlI1.awardType == "JD_BEAN" || l1IiIlI1.awardType == "JD_MARKET") {
            lli11ii = l1IiIlI1.awardDenomination * 1 + "豆";
          } else {
            if (l1IiIlI1.awardType == "JD_E_CARD") {
              lli11ii = l1IiIlI1.assetsName;
            } else {
              if (l1IiIlI1.awardType == "JD_AIQIYI") lli11ii = l1IiIlI1.assetsName;else {
                if (l1IiIlI1.awardType == "JD_REDBAG" || l1IiIlI1.awardType == "JD_RED_BAG") lli11ii = l1IiIlI1.awardDenomination * 1 + "元红包";else {
                  lli11ii = l1IiIlI1.awardName;
                  debugger;
                }
              }
            }
          }
        }
      }
    }
    return lli11ii;
  }
  async ["getOpenCardPath"](Il11liI = this.activityUrl) {
    let liIIiII = await this.get(Il11liI, {});
    const i1l1il11 = cheerio.load(cheerio.load(liIIiII).html());
    let lIi1III = "";
    i1l1il11("script[src]").each((i1I1il1i, I1iiIi1) => {
      const iiIIil11 = i1l1il11(I1iiIi1).attr("src");
      let iliII1Il = iiIIil11.match(/\/\/.*\/js\/index\.\w+\.js/);
      if (iliII1Il && iliII1Il.length > 0) {
        lIi1III = iliII1Il[0];
      }
    });
    liIIiII = await this.get("https:" + lIi1III, {});
    let Iill11I = liIIiII.match(/dingzhi\/([a-zA-Z]+)\/union\/saveTask/);
    return Iill11I[1];
  }
  async ["apiBatch"](lililIi1, i1II1I = {}) {
    let Ii1i11l = i1II1I?.["batchSize"] || 2,
      liIiI1lI = i1II1I?.["execCount"] || 0,
      iIIi1I1 = i1II1I?.["filterFunc"] || null,
      llI1III = i1II1I?.["processFunc"] || null;
    const liil1lI = [];
    for (let IiI1liii = 0; IiI1liii < liIiI1lI; IiI1liii++) {
      for (let IIlil1li = 0; IIlil1li < lililIi1.length; IIlil1li += Ii1i11l) {
        const IlI1ili = lililIi1.slice(IIlil1li, IIlil1li + Ii1i11l),
          iiiiIlII = Promise.all(IlI1ili.map(async llllIl1I => {
            try {
              const lIiil1Ii = await llllIl1I();
              if (lIiil1Ii !== null && (!iIIi1I1 || iIIi1I1(lIiil1Ii))) return llI1III ? llI1III(lIiil1Ii) : lIiil1Ii;
              return null;
            } catch (lI111i) {
              return console.error("任务 " + llllIl1I + " 执行出错：" + lI111i), null;
            }
          }));
        liil1lI.push(iiiiIlII);
      }
    }
    const iIiii11l = (await Promise.all(liil1lI)).flat();
    let Illl1i1 = iIiii11l.filter(lIl1l1lI => lIl1l1lI !== null);
    return llI1III && (Illl1i1 = Illl1i1.map(iIIlllii => {
      try {
        return llI1III(iIIlllii);
      } catch (IlIiilI) {
        return console.error("处理结果 " + iIIlllii + " 出错：" + IlIiilI), null;
      }
    }).filter(liII1lIl => liII1lIl !== null)), Illl1i1;
  }
  ["getActivityId"](lil11l1l = this.activityUrl) {
    const IlIIiI11 = new URLSearchParams(new URL(lil11l1l).search),
      ii1lllii = ["activityId", "giftId", "actId", "token", "code", "a", "id"];
    let iIl1llIl = "";
    for (let iiIIiI1i of ii1lllii) {
      iIl1llIl = IlIIiI11.get(iiIIiI1i);
      if (iIl1llIl) break;
    }
    return !iIl1llIl && (iIl1llIl = this.match(/\/(dz[a-zA-Z0-9]{28,32})/, lil11l1l)), this.activityId = iIl1llIl, this.activityId;
  }
  ["filterUrl"](liIil1i1) {
    if (liIil1i1 === null) return null;
    const I11lIil1 = new URLSearchParams(new URL(liIil1i1).search),
      III11l11 = [];
    for (const [il1lIlIl, Il1il1I1] of I11lIil1.entries()) {
      if (keywords.includes(il1lIlIl)) continue;
      III11l11.push(il1lIlIl + "=" + Il1il1I1);
    }
    if (III11l11.length > 0) return liIil1i1.split("?")[0] + "?" + III11l11.join("&");
    return liIil1i1;
  }
  ["buildActInfo"]() {
    if (!this.activityUrl) {
      return;
    }
    this.activityUrl = this.filterUrl(this.activityUrl);
    this.activityUrl = this.match(/(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/, this.activityUrl);
    this.activityUrl = this?.["activityUrl"]?.["replace"](/(isvjd|lzkjdz|cjhydz|lzkjdzisv|cjhydzisv)/g, iliiiII1 => {
      switch (iliiiII1) {
        case "isvjd":
          return "isvjcloud";
        case "lzkjdz":
          return "lzkj";
        case "cjhydz":
          return "cjhy";
        case "lzkjdzisv":
          return "lzkj-isv";
        case "cjhydzisv":
          return "cjhy-isv";
        default:
          return iliiiII1;
      }
    }) || "";
    this.domain = this.match(/https?:\/\/([^/]+)/, this.activityUrl);
    this.activityId = this.getActivityId(this.activityUrl);
    while (this.activityId.startsWith("https")) {
      this.activityUrl = this.activityId;
      this.activityId = this.getActivityId(this.activityUrl);
    }
    this.activityType = this.getQueryString(this.activityUrl, "activityType");
    this.venderId = this.getQueryString(this.activityUrl, "user_id") || this.getQueryString(this.activityUrl, "userId") || this.match(/\/m\/(\d+)\//, this.activityUrl) || this.getQueryString(this.activityUrl, "venderId");
    this.userId = this.venderId;
    this?.["activityUrl"] && (this.urlPrefix = Object.keys(urlPrefixes).find(iI111I => this.activityUrl.match(urlPrefixes[iI111I])) || "");
    console.log("活动链接 " + this.activityUrl + " " + this.activityType + " " + this.venderId);
  }
  async ["complete"]() {
    if (!this.runAll && this.index >= this.masterNum) {
      this.putMsg("全部完成");
      this.expire = true;
    }
  }
  ["getAwardPrizeInfo"](l1l1I1l) {
    const ili1ilIl = l1l1I1l.awardType === "JD_BEAN" || l1l1I1l.awardType === "JD_MARKET",
      i1IiIi11 = parseInt(l1l1I1l.awardDenomination);
    return {
      "isBean": ili1ilIl,
      "prizeNum": i1IiIi11
    };
  }
  ["formatDateString"](ilIiIi) {
    if (ilIiIi.match(/\d{4}年\d{1,2}月\d{1,2}日\d{2}:\d{2}:\d{2}/)) return ilIiIi.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日(\d{2}:\d{2}:\d{2})/, "$1-$2-$3 $4");
    return ilIiIi;
  }
  async ["getRuleSETime"](lII = this.rule) {
    debugger;
    if (this.actStartTime) {
      return;
    }
    const ilIii11I = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}|\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}|\d{4}年\d{1,2}月\d{1,2}日\d{2}:\d{2}:\d{2})/g,
      liIi11lI = lII.match(ilIii11I);
    if (liIi11lI) {
      const iIi1li1i = this.formatDateString(liIi11lI[0]),
        l1Ii1lii = this.formatDateString(liIi11lI[1]);
      this.actStartTime = new Date(iIi1li1i).getTime();
      this.actEndTime = new Date(l1Ii1lii).getTime();
    } else {
      debugger;
      console.log("未找到活动时间！");
    }
  }
}
module.exports = {
  "http": $,
  "Env": Env,
  "CryptoJS": CryptoJS,
  "notify": notify,
  "fs": fs,
  "cheerio": cheerio,
  "NodeRSA": NodeRSA
};