let mode = __dirname.includes('magic')
const {Env} = mode ? require('../magic') : require('./magic')
const $ = new Env('M邀请有礼INTERACT');
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_INTERACT_INVITE_URL);
if (mode) {
  $.activityUrl = 'https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10070&activityId=1673261534104821762&templateId=7fab7995-298c-44a1-af5a-f79c520fa8a888&nodeId=101001&prd=cjwx'
}
//不需要的奖励名称
let m_wx_address_stop_keyword = process.env.M_INTERACT_INVITE_STOP_KEYWORD || "鼠标垫|测试"
//车头数量
let leaderNum = parseInt(process.env.M_INTERACT_INVITE_LEADER_NUM || 7)
// 过滤活动需要的人头数，奖励超过这个值的就不要了，默认999
let needMaxNum = parseInt(process.env.M_INTERACT_INVITE_MAX_NEED_NUM || 999)
$.activityUrl = $.match(/(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/, $.activityUrl);
$.domain = $.match(/https?:\/\/([^/]+)/, $.activityUrl);
$.activityId = $.getQueryString($.activityUrl, "activityId");
$.leaders = [];
$.invitePin = "";
$.version = "v1.0.0";
console.log("当前版本:" + $.version + ",依赖版本:" + $.superVersion);

$.logic = async function () {
  if (!$.superVersion) {
    throw new Error("请更新脚本");
  }

  if (!$.activityId || !$.activityUrl) {
    $.expire = true;
    $.putMsg("activityId|activityUrl不存在");
    return;
  }

  $.index > leaderNum && ($.needOpenCard = false);
  let llil1iI1 = $.leaders.filter(I1l1l1Il => I1l1l1Il.curCount < I1l1l1Il.needCount && I1l1l1Il.draw === false)?.[0];

  if ($.index > leaderNum && !llil1iI1) {
    $.log("全部完成");
    $.expire = true;
    return;
  }

  $.UA = $.ua();
  let iiIIl11l = await $.isvObfuscator();

  if (iiIIl11l.code !== "0") {
    $.putMsg("获取Token失败");
    return;
  }

  $.Token = iiIIl11l?.["token"];
  let IiI1IIIi = {
    status: "0",
    activityId: $.activityId,
    tokenPin: $.Token,
    source: "01",
    shareUserId: $.invitePin || "",
    uuid: ""
  },
      IliIliIl = await $.api("/api/user-info/login", IiI1IIIi);

  if (IliIliIl.resp_code !== 0) {
    $.putMsg("登录失败");
    return;
  }

  $.Token = IliIliIl.data.token;

  try {
    $.openCardUrl = IliIliIl.data.joinInfo.openCardUrl;
    $.venderId = IliIliIl.data.venderId || $.openCardUrl.split("venderId=")[1].split("&")[0];
  } catch (lII1ll) {
    $.venderId = IliIliIl.data.venderId || IliIliIl.data.shopId;
  }

  $.shopId = IliIliIl.data.shopId;
  $.shopName = IliIliIl.data.shopName;
  $.joinCode = IliIliIl.data.joinInfo.joinCodeInfo.joinCode;
  $.joinDes = IliIliIl.data.joinInfo.joinCodeInfo.joinDes;
  $.index <= leaderNum && (IliIliIl.data.joinInfo.joinCodeInfo.joinCode == "1001" ? $.log("已经是会员了") : (await $.openCard($.venderId), await $.wait(500, 1000)));
  await $.api("/api/task/followShop/follow", {});
  let I1lIiilI = IliIliIl.data.joinInfo.joinCodeInfo.joinCode === "1001" ? 1 : -1;

  if ($.index > leaderNum && I1lIiilI === 1) {
    $.log("已经是会员了");
    return;
  }

  let IlII1iiI = await $.api("/api/task/member/prizeList", {});

  if (IlII1iiI.resp_code !== 0) {
    $.putMsg("获取活动信息失败");
    return;
  }

  $.content = IlII1iiI.data.prizeInfo;
  let lI1Il1II = await $.api("/api/active/basicInfo", {
    activityId: $.activityId
  });
  $.startTime = lI1Il1II.data.startTime;
  $.endTime = lI1Il1II.data.endTime;

  if ($.timestamp() > lI1Il1II.data.endTime) {
    $.putMsg("活动已过期");
    $.expire = true;
    return;
  }

  if (lI1Il1II.data.startTime > $.timestamp()) {
    $.putMsg("未开始");
    $.expire = true;
    return;
  }

  let l1lIlill = $.content.filter(l1IliiI => ![2, 4, 6, 10, 11].includes(l1IliiI.prizeType) && l1IliiI.prizeName.match(new RegExp(m_wx_address_stop_keyword)) == null && l1IliiI?.["days"] < needMaxNum);
  debugger;

  if (l1lIlill.filter(ilI1i1 => ilI1i1.leftNum > 0).length === 0) {
    $.putMsg("垃圾或领完");
    this.expire = true;
    return;
  }

  l1lIlill.filter(lII1l1iI => lII1l1iI.leftNum === 0).forEach(iliI1lI1 => {
    $.leaders.filter(l111Illl => l111Illl.prizeInfoId === iliI1lI1.id).forEach(I11IiI1I => {
      I11IiI1I.draw = true;
      I11IiI1I.curCount = 9999999;
    });
  });
  $.invitePin = llil1iI1?.["invitePin"] || "";
  let i111iiII = await $.api("/api/task/member/getMember", {
    shareUserId: $.invitePin || ""
  });

  if (llil1iI1 && llil1iI1.needCount - llil1iI1.curCount > $.cookies.length - $.index) {
    $.putMsg("ck不够了停车");
    $.expire = true;
    return;
  }

  if ($.index <= leaderNum) {
    let IIiiI = await $.api("/api/task/share/getUserId", {
      shareUserId: $.invitePin || ""
    });
    $.log("当前已邀请:" + i111iiII.data.shareUser);
    $.putMsg("队长");

    for (let i1lIlIl1 of l1lIlill || []) {
      $.leaders.push({
        index: $.index,
        cookie: $.cookie,
        token: $.Token,
        prizeInfoId: i1lIlIl1.id,
        invitePin: IIiiI.data.shareUserId,
        username: $.username,
        needCount: i1lIlIl1.days,
        curCount: i111iiII.data.shareUser,
        draw: false
      });
    }
  }

  if (I1lIiilI !== 1) {
    let Il1l1iIl = await $.openCard($.venderId);
    await $.api("/api/task/followShop/follow", {});
    i111iiII = await $.api("/api/task/member/getMember", {
      shareUserId: $.invitePin || ""
    });

    if (Il1l1iIl?.["code"] === 0 && Il1l1iIl?.["success"] && Il1l1iIl?.["busiCode"] !== "210" && Il1l1iIl?.["busiCode"] !== "510" && Il1l1iIl?.["busiCode"] !== "9003") {
      let iIiil1i1 = $.leaders.filter(IilI1lil => IilI1lil.invitePin === $.invitePin)[0].username,
          ilIilill = $.leaders.filter(lIl1lIIl => lIl1lIIl.invitePin === $.invitePin)[0].curCount;
      $.log("助力[" + iIiil1i1 + "]成功，已邀请" + ilIilill + "人，助力数++++++");
      await $.api("/api/user-info/login", IiI1IIIi);
      $.leaders.filter(ilIiiiII => ilIiiiII.invitePin === $.invitePin && ilIiiiII.index !== $.index).forEach(IIl11lii => IIl11lii.curCount++);
    }
  }

  let I1iillli = $.leaders.filter(IllIllII => IllIllII.curCount >= IllIllII.needCount && IllIllII.draw === false) || [];

  if (I1iillli.length > 0) {
    let Ill11111 = I1iillli?.[0];

    try {
      $.cookie = $.cookies[Ill11111.index - 1];
      $.username = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      let IiIIlIll = await $.isvObfuscator();

      if (IiIIlIll.code !== "0") {
        $.putMsg("获取Token失败");
        return;
      }

      $.Token = IiIIlIll?.["token"];
      let iIi1Iili = {
        status: "0",
        activityId: $.activityId,
        tokenPin: $.Token,
        source: "01",
        shareUserId: $.invitePin || "",
        uuid: ""
      },
          lliIlli = await $.api("/api/user-info/login", iIi1Iili);
      $.joinCode = lliIlli.data.joinInfo.joinCodeInfo.joinCode;
      $.joinDes = lliIlli.data.joinInfo.joinCodeInfo.joinDes;
      $.joinCode == "1004" ? ($.log("关注店铺"), await $.api("/api/task/followShop/follow", {})) : $.log($.joinCode + " " + $.joinDes);
      $.Token = lliIlli.data.token;

      for (let l1lIiIl of I1iillli) {
        await getPrize(l1lIiIl, $.Token, 0);
      }
    } catch (liiIl11) {
      $.log(liiIl11);
    }
  }
};

$.after = async function () {
  $.msg.push("    活动时间:" + $.formatDate($.startTime, "yyyy-MM-dd HH:mm:ss") + " 至" + $.formatDate($.endTime, "yyyy-MM-dd HH:mm:ss"));

  for (let i1iilili of $.content?.["reverse"]() || []) {
    $.msg.push("  邀请" + i1iilili.days + "人 " + i1iilili.prizeName + " 共" + i1iilili.leftNum + "/" + i1iilili.allNum + "份");
  }

  $.msg.push("\nexport M_INTERACT_INVITE_URL=\"" + $.activityUrl + "\"");
};

async function getPrize(Ilill111, I1iiIIl1, l1111ii1 = 0) {
  $.index = Ilill111.index;
  $.username = Ilill111.username;
  $.Token = I1iiIIl1;
  let iiliilII = await $.api("/api/prize/receive/acquire", {
    prizeInfoId: Ilill111.prizeInfoId
  });
  $.log("" + JSON.stringify(iiliilII));

  if (iiliilII.resp_code === 0) {
    $.putMsg("领取成功");
    iiliilII.data.prizeName && $.putMsg(iiliilII.data.prizeName);

    if (iiliilII.data.prizeType == 3) {
      $.addressId = iiliilII.data.addressId;
      $.prizeName = iiliilII.data.prizeName;
      await $.saveAddress();
    }

    $.leaders.filter(I11lI1II => I11lI1II.index === Ilill111.index && I11lI1II.prizeInfoId === Ilill111.prizeInfoId && I11lI1II.draw === false)[0].draw = true;
  } else {
    if (iiliilII.resp_msg.includes("已领取")) {
      $.putMsg(iiliilII.resp_msg);
      $.leaders.filter(IIii1i1I => IIii1i1I.index === Ilill111.index && IIii1i1I.prizeInfoId === Ilill111.prizeInfoId).forEach(i1I1IiIl => {
        i1I1IiIl.draw = true;
      });
    } else {
      $.putMsg(iiliilII.resp_msg);
      $.leaders.filter(iiiII => iiiII.index === Ilill111.index).forEach(liIi1iII => {
        liIi1iII.draw = true;
      });
    }
  }
}

$.run({
  whitelist: ["1-20"]
}).catch(reason => $.log(reason));