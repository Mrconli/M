// noinspection DuplicatedCode
let mode = __dirname.includes('magic')
const {Env} = mode ? require('../magic') : require('./magic')
const $ = new Env('M分享有礼');
$.activityUrl = decodeURIComponent(process.argv.splice(2)?.[0] || process.env.M_WX_SHARE_URL);
if (mode) {
  $.activityUrl = `https://lzkj-isv.isvjcloud.com/prod/cc/interactsaas/index?activityType=10043&activityId=1698973939696050178&templateId=20210714190900fxyl011&nodeId=101001043&prd=cjwx`
}
//前n个号有机会成为队长
let leaderNum = parseInt(process.env.M_WX_SHARE_LEADER_NUM || 7)
//超过这个人数的奖励不要了
let needMaxNum = parseInt(process.env.M_WX_SHARE_MAX_NEED_NUM || 50)
$.leaders = [];
$.version = "v1.3.0";

$.logic = async function () {
  if (!$.superVersion) {
    throw new Error("请更新脚本");
  }

  if (!$.activityId || !$.activityUrl) {
    $.log("活动id不存在");
    $.expire = true;
    return;
  }

  $.UA = $.ua();
  let iIllilii = await $.isvObfuscator();

  if (iIllilii.code !== "0") {
    $.putMsg("获取Token失败");
    return;
  }

  $.Token = iIllilii?.["token"];

  if (["10043"].includes($.activityType)) {
    await $.login();
    let ilIlI1l = $.leaders.filter(IiIlII11 => IiIlII11.needShareTimes - IiIlII11.count > 0)?.[0] || null;

    if ($.index > leaderNum && !ilIlI1l) {
      $.putMsg("全部完成");
      $.expire = true;
      return;
    }

    $.friendUuid = ilIlI1l?.["myUuid"] || "";
    let Il1i11li = await $.api("/api/task/sharePolitely/activity", {
      shareUserId: $.friendUuid || ""
    });

    if (Il1i11li.resp_code !== 0) {
      $.putMsg("活动已结束");
      $.expire = true;
      return;
    }

    $.friendUuid;

    if ($.index <= leaderNum) {
      let lI1iIIli = await $.api("/api/task/share/friends", {});
      const lil1ll1i = lI1iIIli.data.num;
      $.putMsg("已成功邀请 " + lil1ll1i + " 人");
      let Il1IlllI = await $.api("/api/task/share/getUserId", {}),
          lI1lIiII = Il1i11li.data.shareSuccessTimesList;

      for (let li11lI1l of lI1lIiII || []) {
        $.prizeList.filter(liIi1i1I => liIi1i1I.id === li11lI1l.prizeInfoId)[0].shareTimes = li11lI1l.successTimes;
        $.prizeList.filter(liI1I1lI => liI1I1lI.id === li11lI1l.prizeInfoId)[0].prizeInfoId = li11lI1l.prizeInfoId;
        $.prizeList.filter(Illl11l => Illl11l.id === li11lI1l.prizeInfoId)[0].status = li11lI1l.status;
      }

      $.prizeList = $.prizeList.filter(lIl11I1I => ![2, 4].includes(lIl11I1I.prizeType));

      if ($.prizeList.length === 0) {
        $.putMsg("垃圾活动");
        $.expire = true;
        return;
      }

      $.prizeList = $.prizeList.filter(ll1lil => ll1lil.status !== 3 && ![2, 4].includes(ll1lil.prizeType));

      if ($.prizeList.length === 0) {
        $.putMsg("已领取");
        return;
      }

      debugger;
      $.log("队长");

      for (let I1Ii11lI of $.prizeList || []) {
        $.leaders.push({
          index: $.index,
          username: $.username,
          token: $.Token,
          pin: $.Pin,
          myUuid: Il1IlllI.data.shareUserId,
          needShareTimes: I1Ii11lI.shareTimes,
          count: lil1ll1i,
          draw: false,
          drawInfoId: I1Ii11lI.prizeInfoId
        });
      }
    }

    if ($.index > 1) {
      let ii1lliIi = await $.api("/api/task/bargain/guest/myself", {
        shareUserId: $.friendUuid || ""
      });

      if (!ii1lliIi.data) {
        $.log("助力[" + decodeURIComponent($.friendUuid) + "]成功，助力数++++++");
        $.leaders.filter(iIIiill => iIIiill.myUuid === $.friendUuid && iIIiill.index !== $.index).forEach(lI1l1i => lI1l1i.count++);
      }
    }

    let Ililllli = $.leaders.filter(IliII1ii => IliII1ii.count >= IliII1ii.needShareTimes && IliII1ii.draw === false) || [];

    if (Ililllli.length > 0) {
      let IlIii1 = Ililllli?.[0];

      try {
        $.cookie = $.cookies[IlIii1.index - 1];
        $.username = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        let iIlIi1lI = await $.isvObfuscator();

        if (iIlIi1lI.code !== "0") {
          $.putMsg("获取Token失败");
          return;
        }

        $.Token = iIlIi1lI?.["token"];
        let llIli1li = {
          status: "0",
          activityId: $.activityId,
          tokenPin: $.Token,
          source: "01",
          shareUserId: $.invitePin || "",
          uuid: ""
        },
            i111i1I1 = await $.api("/api/user-info/login", llIli1li);
        $.Token = i111i1I1.data.token;
        await $.api("/api/task/sharePolitely/activity", {});

        for (let iiIl1l1l of Ililllli) {
          await getPrize(iiIl1l1l, 0);
        }
      } catch (I1II1iII) {
        $.log(I1II1iII);
      }
    }

    return;
  }

  if (["10068"].includes($.activityType)) {
    await $.login();
    let iIiIIil1 = $.leaders.filter(ii1l1lI1 => ii1l1lI1.needShareTimes - ii1l1lI1.count > 0)?.[0] || "";

    if ($.index > leaderNum && !iIiIIil1) {
      $.putMsg("全部完成");
      $.expire = true;
      return;
    }

    $.friendUuid = iIiIIil1?.["myUuid"] || "";
    let iiIIlIl1 = await $.api("/api/task/inviteFollowShop/getInviteInfo", {});
    $.friendUuid;
    let IIli11i1 = $.prizeList.filter(ll1lIII => ll1lIII.prizeType !== 2 && ll1lIII.prizeType !== 4 && ll1lIII.prizeType !== 5 && ll1lIII.prizeType !== 11 && ll1lIII.leftNum !== 0);

    if (IIli11i1.length === 0) {
      $.putMsg("垃圾或领完");
      $.expire = true;
      return;
    }

    if ($.index <= leaderNum) {
      let iiI1111I = await $.api("/api/task/share/getUserId", {});
      $.log("队长");

      for (let ii11111l of $.prizeList || []) {
        ii11111l.leftNum !== 0 && $.leaders.push({
          index: $.index,
          username: $.username,
          token: $.Token,
          pin: $.Pin,
          myUuid: iiI1111I.data.shareUserId,
          needShareTimes: ii11111l.days,
          count: iiIIlIl1?.["data"]?.["shareNum"] || 0,
          draw: false,
          drawInfoId: ii11111l.id
        });
      }
    }

    if ($.index > 1) {
      let I1l1ll11 = await $.api("/api/task/inviteFollowShop/follow", {
        shareUserId: $.friendUuid || ""
      });

      if (I1l1ll11.resp_code == 0) {
        if (I1l1ll11.data.flag) {
          $.log("助力[" + decodeURIComponent($.friendUuid) + "]成功，助力数++++++");
          $.leaders.filter(il1iIl1l => il1iIl1l.myUuid === $.friendUuid && il1iIl1l.index !== $.index).forEach(lI1iii1i => lI1iii1i.count++);
        }
      } else {
        $.log(I1l1ll11.resp_msg);
      }
    }

    let ll1IIiIl = $.leaders.filter(Ii1lill => Ii1lill.count >= Ii1lill.needShareTimes && Ii1lill.draw === false) || [];
    // $.log(ll1IIiIl);

    if (ll1IIiIl.length > 0) {
      let ii11Ill1 = ll1IIiIl?.[0];

      try {
        $.cookie = $.cookies[ii11Ill1.index - 1];
        $.username = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        let l1il1ll1 = await $.isvObfuscator();

        if (l1il1ll1.code !== "0") {
          $.putMsg("获取Token失败");
          return;
        }

        $.Token = l1il1ll1?.["token"];
        let IIliiI1 = {
          status: "0",
          activityId: $.activityId,
          tokenPin: $.Token,
          source: "01",
          shareUserId: $.invitePin || "",
          uuid: ""
        },
            l11illl = await $.api("/api/user-info/login", IIliiI1);
        $.Token = l11illl.data.token;
        await $.api("/api/task/bargain/guest/myself", {
          shareUserId: $.friendUuid || ""
        });
        await $.api("/api/task/inviteFollowShop/getInviteInfo", {});

        for (let l1iiilII of ll1IIiIl) {
          await getPrize(l1iiilII, 0);
        }
      } catch (iIilIiii) {
        $.log(iIilIiii);
      }
    }

    return;
  }

  if (["hdb-isv.isvjcloud.com", "jingyun-rc.isvjcloud.com"].includes($.domain)) {
    await $.login();
    const Ill1iI1i = await $.api("/front/activity/loadMyInviteLogs", {});

    if (!Ill1iI1i.succ) {
      $.putMsg(Ill1iI1i.message);
      return;
    }

    const I1IIiIil = Ill1iI1i.result,
          IilIl1 = I1IIiIil.total;
    $.putMsg("已成功邀请 " + IilIl1 + " 人");

    if ($.index <= leaderNum) {
      const ilii11l = await $.api("/front/activity/loadShareSetting", {});

      if (!ilii11l.succ) {
        $.putMsg(ilii11l.message);
        return;
      }

      const I1Il11il = ilii11l.result?.["fissionCouponSetting"],
            illIili1 = I1Il11il.inviteConfigs;

      for (const iliiil1i of illIili1) {
        await this.wait(1000, 1000);
        const ii1lIlIl = iliiil1i.helpNum,
              l11Ii1i1 = iliiil1i.award,
              ilIllIil = l11Ii1i1.awardName;

        if (IilIl1 >= ii1lIlIl) {
          const iIIi1I1I = await $.api("/front/activity/postShareAward", {
            awardId: l11Ii1i1.id
          });

          if (!iIIi1I1I.succ) {
            $.putMsg(ilIllIil + " " + iIIi1I1I.message);
            continue;
          }

          const I1lI1li1 = iIIi1I1I.result;

          if (!I1lI1li1.succ) {
            const l1iI1li = I1lI1li1.errorMsg;
            $.putMsg(ilIllIil + " " + l1iI1li);
          } else {
            $.putMsg("获得奖励：" + I1lI1li1.dmActivityLog.awardName);
          }

          continue;
        }

        const liliIill = {
          index: $.index,
          username: $.username,
          token: $.Token,
          pin: $.Pin,
          friendUuid: $.aesBuyerNick,
          count: IilIl1 || 0,
          needShareTimes: ii1lIlIl,
          draw: false,
          drawInfoId: l11Ii1i1.id,
          drawName: l11Ii1i1.awardName
        };
        $.leaders.push(liliIill);
      }

      await $.reportActionLog({
        actionType: "shareAct"
      });
    }

    let iiIilIi1 = $.leaders.filter(iii1Ilii => iii1Ilii.needShareTimes - iii1Ilii.count > 0)?.[0] || "";

    if ($.index > leaderNum && !iiIilIi1) {
      $.putMsg("全部完成");
      $.expire = true;
      return;
    }

    if (iiIilIi1.needShareTimes > $.cookies.length - $.index || iiIilIi1.needShareTimes - iiIilIi1.count > needMaxNum) {
      $.putMsg("ck不够了，停车");
      $.expire = true;
      return;
    }

    if ($.index === 1) {
      $.putMsg("ck1 不助力任何人");
      return;
    }

    if (iiIilIi1.index === $.index) {
      $.putMsg("不能助力自己");
      return;
    }

    if (!iiIilIi1) {
      return;
    }

    $.log("本次助力对象：" + iiIilIi1.username + " " + iiIilIi1.drawInfoId);
    const ilI11iil = await $.api("/front/activity/postShareAward", {
      inviterNick: iiIilIi1.friendUuid
    });

    if (ilI11iil.succ) {
      const I1i1llIl = ilI11iil.result;
      I1i1llIl?.["succ"] && ($.putMsg(I1i1llIl.errorMsg + " 助力对象：" + iiIilIi1.username), i1Ili1iI(iiIilIi1.friendUuid, "incrementCount"));
    } else {
      $.putMsg(ilI11iil.message);
    }

    let llIl1li1 = $.leaders.filter(Il1I1liI => Il1I1liI.count >= Il1I1liI.needShareTimes && Il1I1liI.draw === false) || [];

    if (llIl1li1.length > 0) {
      let lllli1l = llIl1li1?.[0];

      try {
        $.cookie = $.cookies[lllli1l.index - 1];
        $.username = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        let Iii1iIli = await $.isvObfuscator();

        if (Iii1iIli.code !== "0") {
          $.putMsg("获取Token失败");
          return;
        }

        $.Token = Iii1iIli?.["token"];
        await $.login();
        const i1l1 = await $.api("/front/activity/postShareAward", {
          awardId: lllli1l.drawInfoId
        });

        if (!i1l1.succ) {
          $.putMsg(i1l1.message);
          return;
        }

        const I1lIII1l = i1l1.result;

        if (!I1lIII1l.succ) {
          const l1lliII = I1lIII1l.errorMsg;
          $.putMsg(lllli1l.drawName + " " + l1lliII);

          if (l1lliII.match(/奖品已发完/)) {
            return;
          }
        } else {
          $.putMsg(I1lIII1l.dmActivityLog.awardName);
          i1Ili1iI(iiIilIi1.friendUuid, "draw", iiIilIi1.drawInfoId);
        }
      } catch (iii1l1lI) {
        $.log(iii1l1lI);
      }
    }

    return;

    function i1Ili1iI(IIli1I1i, iI1Il, lii11iI1 = 0) {
      for (let IIillli = 0; IIillli < $.leaders.length; IIillli++) {
        const IIllii = $.leaders[IIillli];

        if (IIllii.friendUuid === IIli1I1i) {
          if (iI1Il === "draw" && $.leaders[IIillli].drawInfoId == lii11iI1) {
            $.leaders[IIillli].draw = true;
          } else {
            iI1Il === "incrementCount" && $.leaders[IIillli].count++;
          }
        }
      }
    }
  }

  await $.getSimpleActInfoVo();

  if ($.expire) {
    return;
  }

  await $.getMyPing();

  if (!$.Pin) {
    return;
  }

  await $.accessLog();
  let ill1l1li = $.leaders.filter(l1lill1l => l1lill1l.needShareTimes - l1lill1l.count > 0)?.[0] || null;

  if ($.index > leaderNum && !ill1l1li) {
    $.putMsg("全部完成");
    $.expire = true;
    return;
  }

  $.friendUuid = ill1l1li?.["myUuid"] || "";
  let iII1i1l = await $.api("wxShareActivity/activityContent", "activityId=" + $.activityId + "&pin=" + $.Pin + "&friendUuid=" + ($.friendUuid || ""));

  if (!iII1i1l.result || !iII1i1l.data) {
    $.putMsg(iII1i1l.errorMessage);
    return;
  }

  $.friendUuid && $.leaders.filter(liiIl1Il => liiIl1Il.myUuid === $.friendUuid).forEach(llill1I => llill1I.count++);
  $.rule = iII1i1l.data.rule;
  $.actStartTime = $.match(/(\d+-\d+-\d+ \d+:\d+) 至/, iII1i1l.data.rule) + ":00";

  if ($.parseDate($.actStartTime) > $.timestamp()) {
    $.putMsg("活动未开始");
    this.expire = true;
    return;
  }

  $.actEndTime = $.match(/至 (\d+-\d+-\d+ \d+:\d+)/, iII1i1l.data.rule) + ":00";

  if ($.timestamp() > $.parseDate($.actEndTime)) {
    $.putMsg("活动已结束");
    this.expire = true;
    return;
  }

  $.prizeList = iII1i1l.data.drawContentVOs || [];
  let I1lIil11 = $.prizeList.filter(IlliI11i => [6, 7, 9, 13, 14, 15, 16].includes(IlliI11i.type) && [0, 1, 2, 4].includes(IlliI11i.linkStatus) && IlliI11i.shareTimes < needMaxNum);

  if ($.index > leaderNum && I1lIil11.length === 0) {
    $.expire = true;
    $.putMsg("垃圾或领完");
    return;
  }

  if ($.prizeList.filter(i1ili1ii => [6, 7, 9, 13, 14, 15, 16].includes(i1ili1ii.type)).length === 0) {
    $.expire = true;
    $.putMsg("垃圾活动");
    return;
  }

  if ($.prizeList.filter(IIli1l1l => IIli1l1l.linkStatus === 3).length === $.prizeList.length) {
    $.expire = true;
    $.putMsg("奖品已领完");
    return;
  }

  if ($.index <= leaderNum && I1lIil11.length > 0) {
    $.putMsg("队长");

    for (let illii1i1 of I1lIil11 || []) {
      if (illii1i1.linkStatus === 2) {
        $.putMsg("已领过" + illii1i1.name);
        continue;
      }

      $.leaders.push({
        index: $.index,
        token: $.Token,
        username: $.username,
        pin: $.Pin,
        cookie: $.cookie,
        myUuid: iII1i1l.data.myUuid,
        needShareTimes: illii1i1.shareTimes + 2,
        count: illii1i1.linkStatus === 1 ? illii1i1.shareTimes + 2 : 0,
        draw: false,
        drawInfoId: illii1i1.drawInfoId
      });
    }
  }

  let Iiiill = $.leaders.filter(iii1lIIi => iii1lIIi.needShareTimes <= iii1lIIi.count && iii1lIIi.draw === false);

  if (Iiiill.length > 0) {
    let iIi11lli = Iiiill?.[0];

    try {
      $.cookie = $.cookies[iIi11lli.index - 1];
      $.username = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      let Ii1Il1Ii = await $.isvObfuscator();

      if (Ii1Il1Ii.code !== "0") {
        $.putMsg("获取Token失败");
        return;
      }

      $.Token = Ii1Il1Ii?.["token"];
      await $.api("customer/getMyPing", "userId=" + $.venderId + "&token=" + $.Token + "&fromType=APP");
      $.Pin = iIi11lli.pin;
      await $.api("common/" + ($.domain.includes("cjhy") ? "accessLog" : "accessLogWithAD"), "venderId=" + $.venderId + "&code=" + $.activityType + "&pin=" + $.Pin + "&activityId=" + $.activityId + "&pageUrl=" + encodeURIComponent($.activityUrl) + "&subType=app&adSource=");

      for (let li1111lI of Iiiill) {
        await drawPrize(li1111lI, 0);
      }
    } catch (lI1ll11i) {
      $.log(lI1ll11i);
    }
  }

  ill1l1li = $.leaders.filter(Il1llil1 => Il1llil1.needShareTimes - Il1llil1.count > 0)?.[0] || null;
  $.index > leaderNum && !ill1l1li && ($.putMsg("全部完成"), $.expire = true);
};

$.getPrizeList = async () => {
  if (["10068"].includes($.activityType)) {
    let I1lIll1 = await $.api("/api/task/inviteFollowShop/prizeList", {});
    $.prizeList = I1lIll1.data.prizeInfo || [];
  }

  if (["10043"].includes($.activityType)) {
    let llIl1l1 = await $.api("/api/prize/drawPrize", {});
    $.prizeList = llIl1l1.data.prizeInfo || [];
  }
};

$.after = async function () {
  try {
    $.msg.push("当前:" + $.index);

    if (["hdb-isv.isvjcloud.com", "jingyun-rc.isvjcloud.com"].includes($.domain)) {
      const llllIIii = await $.api("/front/activity/loadShareSetting", {});

      if (!llllIIii.succ) {
        $.putMsg(llllIIii.message);
      } else {
        const iliil11I = llllIIii.result?.["fissionCouponSetting"];

        for (let il11lIIl of iliil11I.inviteConfigs) {
          $.msg.push((il11lIIl?.["helpNum"] || 0) + "人，" + il11lIIl?.["award"]["awardName"]);
        }
      }
    } else {
      for (let l1I11li of $.prizeList) {
        ["10043", "10068"].includes($.activityType) ? $.msg.push("    " + (l1I11li?.["shareTimes"] || l1I11li?.["days"] || 0) + "人, " + l1I11li?.["prizeName"] + "，剩" + l1I11li?.["leftNum"] + "份") : $.msg.push("    " + (l1I11li?.["shareTimes"] || 0) + "人，" + l1I11li?.["name"] + "，共" + l1I11li?.["prizeNum"] + "份");
      }
    }
  } catch (I1ilIl) {
    console.log(I1ilIl);
  }

  console.log($.rule);
  $.msg.push("export M_WX_SHARE_URL=\"" + $.activityUrl + "\"");
};

async function drawPrize(Il1l11Il, IIiiII1I = 0) {
  let lI1111I1 = Il1l11Il.drawInfoId,
      II1iili1 = await $.api("wxShareActivity/getPrize", "activityId=" + $.activityId + "&pin=" + $.Pin + "&drawInfoId=" + lI1111I1);
  console.log(II1iili1);

  if (II1iili1.result && II1iili1.data && II1iili1.data.drawOk) {
    $.index = Il1l11Il.index;
    $.username = Il1l11Il.username;
    $.putMsg(II1iili1.data.name);
    II1iili1.data.needWriteAddress === "y" && II1iili1.data.drawInfoType === 7 && ($.addressId = II1iili1.data.addressId, $.prizeName = II1iili1.data.name, await $.saveAddress());
    $.leaders.filter(iIi1lil => iIi1lil.needShareTimes === iIi1lil.count && iIi1lil.draw === false)[0].draw = true;
  } else {
    try {
      if (II1iili1.errorMessage.includes("店铺会员") && IIiiII1I === 0) {
        await $.openCard();
        await drawPrize(Il1l11Il, 1);
      } else {
        if (II1iili1.errorMessage.includes("您已领取") && IIiiII1I === 0) {
          $.leaders.filter(Il1Il111 => Il1Il111.needShareTimes === Il1Il111.count && Il1Il111.draw === false)[0].draw = true;
        } else {
          II1iili1.errorMessage.includes("奖品已发完") && IIiiII1I === 0 && ($.leaders.filter(lllII11l => lllII11l.drawInfoId === lI1111I1).forEach(i1iI11ii => i1iI11ii.draw = true), $.leaders.filter(iiiIl1I => iiiIl1I.drawInfoId === lI1111I1).forEach(i1I1i11 => i1I1i11.count = 999), $.putMsg(II1iili1.errorMessage), await $.wxStop(II1iili1.errorMessage));
        }
      }
    } catch (llI11II) {
      $.expire = true;
    }
  }
}

async function getPrize(ilIiiI, Il11III1 = 0) {
  let Illiiii1 = $.index,
      l11111iI = $.username;
  console.log(ilIiiI);
  let IIillI11 = await $.api("/api/prize/receive/acquire", {
    prizeInfoId: ilIiiI.drawInfoId,
    status: 1
  });
  $.index = ilIiiI.index;
  $.username = ilIiiI.username;
  console.log(IIillI11);

  if (IIillI11.resp_code === 0) {
    $.log("领取成功");
    $.index = ilIiiI.index;
    $.username = ilIiiI.username;
    IIillI11.data.prizeName && $.putMsg(IIillI11.data.prizeName);
    IIillI11.data.prizeType == 3 && ($.addressId = IIillI11.data.addressId, $.prizeName = IIillI11.data.prizeName, await $.saveAddress());

    if (IIillI11.data.prizeType == 7) {
      $.putMsg(JSON.parse(IIillI11.data?.["prizeJson"] || {})?.["cardNumber"] || "");
    }

    $.leaders.filter(iliIlili => iliIlili.count >= iliIlili.needShareTimes && iliIlili.draw === false)[0].draw = true;
  } else {
    IIillI11.resp_msg.includes("已领取") ? ($.putMsg(IIillI11.resp_msg), $.leaders.filter(III1IIIi => III1IIIi.count >= III1IIIi.needShareTimes && III1IIIi.draw === false)[0].draw = true) : ($.putMsg(IIillI11.resp_msg), $.leaders.filter(li1IIi11 => li1IIi11.count >= li1IIi11.needShareTimes && li1IIi11.draw === false)[0].draw = true);
  }

  $.index = Illiiii1;
  $.username = l11111iI;
}

$.run().catch(reason => $.log(reason));