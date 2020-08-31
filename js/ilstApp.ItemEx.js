/**
 * メニューバーの基礎の描画を省略化するためのクラスです
 * extends 用のクラスです
 */

ilstApp.itemMnuBase = class extends ilstApp.item{
  constructor(prm) {
    super(
      cmb(true, {
        mrgn: 2
        ,accptEvnt: true
        ,ex: {
          btnLst: []
          ,evntLst: []

          ,tapEvntStrt: function(evntRct, btn, i) {}
          ,tapEvntEnd:  function(stat) {}

          ,bgClr:  "#888888"
          ,boxClr: ["#999999", "#696969"]
          ,frmClr: "#666666"
          ,ftClr:  "#ffffff"
          ,r: 0

          ,tmFire: 0
          ,tmWait: 75

          ,wBs: 0 ,hBs: 0, xBs: 0, yBs: 0     //  サイズに対する割合 リサイズイベントで使用

          ,lyr: false       //  対象レイヤー
        }
      }, prm)
    );

    // リサイズイベント時に比率指定で使用する変数
    var lyr = this.ex.lyr;
    var cnvs = lyr.cnvs;
    // キャンバスが使用されている場合
    if (cnvs) {
      this.wBs = this.w / cnvs.width;
      this.hBs = this.h / cnvs.height;
      this.xBs = this.x / cnvs.width;
      this.yBs = this.y / cnvs.height;
    }
  };

  // イベント
  evnt(e) {
    if (e.typ != "tap") return false;
    var evntLst = this.ex.evntLst;

    for (var i = 0; i < evntLst.length; i++) {
      var evntRct = evntLst[i];
      var btn = this.ex.btnLst[i];

      if (! isRng(evntRct, e)) continue;

      // イベントを実行
      this.stat = 1;      //  押下状態
      btn.stat = 1;       //  押下状態
      var $SP = ilstApp.$SP;

      // 押された時間を記録
      this.ex.tmFire = $SP.tm.phase.update.sum;
      this.ex.tapEvntStrt.apply(this, [evntRct, btn, i]);
      this.needRender = true;
      return true;
    }
    return false;
  };

  // アップデート
  update() {
    if (this.stat == 1) {
      var $SP = ilstApp.$SP;
      var elps = $SP.tm.phase.update.sum;

      if (elps >= this.ex.tmFire + this.ex.tmWait) {
        // 押下待機時間 経過
        this.ex.tapEvntEnd.apply(this, [this.stat]);

        this.ex.btnLst.forEach((item, i) => {
          item.stat = 0;
        });
        this.stat = 0;
        this.needRender = true;
      }
    }
  }

  // ボタンのイベントを登録します
  setEvntRect(x, y, w, h, lyr, i) {
    // 既に登録されていれば終了
    var evntLst = this.ex.evntLst;
    if (evntLst.length > i) return;

    var evntRct = {};
    evntRct.x = x;  evntRct.y = y;  evntRct.w = w;  evntRct.h = h;

    // レイアウト分加算
    if (lyr) {
      var clientRect = lyr.tgtEle.getBoundingClientRect();
      evntRct.x += clientRect.left;
      evntRct.y += clientRect.top;
    }

    evntLst.push(evntRct);

    if (typeof this.ex.btnLst[i] == "undefined") {
      // ボタンが用意されていない場合 セット
      this.ex.btnLst[i] = {stat: 0};
    }
  };

  // ウィンドウがリサイズされたときに行う関数
  resizeEvnt() {
    this.ex.evntLst = [];
    this.needRender = true;

    var lyr = this.ex.lyr;
    var cnvs = lyr.cnvs;

    // キャンバスを設定しているならレイアウト
    if (cnvs) {
      this.w = cnvs.width   * this.wBs;
      this.h = cnvs.height  * this.hBs;
      this.x = cnvs.width   * this.xBs;
      this.y = cnvs.height  * this.yBs;
    }
  }
}

/**
 * ダイヤログです チュートリアルや情報を知らせる時に使います
 */
ilstApp.itemDialog = class extends ilstApp.itemMnuBase{
  constructor(prm) {
    super(
      cmb(true, {
         typ: "dialog"
        ,needUpdate: false
        ,accptEvnt: true

        ,ex: {
           pg: [{ttl: null, txt: null, img: null}]   //  {ttl, txt, img}
          ,pgNow: 0
          ,tapEvntStrt: function(state) {}    //  ボタンが押された時のイベント　

          ,bgClr: "#ffffff"
          ,ftClr: "#637180"
          ,tocR: 4

          ,btnX: 0
          ,btnY: 0
          ,btnW: 70
          ,btnH: 40
        }
      }, prm));
  };

  // レンダー
  render() {
    super.render();

    ilstApp.utl.clrCntxt(my.lyr.bg);

    var $SP = ilstApp.$SP;
    var cont = this.ex.pg[this.ex.pgNow];

    // バックグラウンド
    ilstApp.utl.drwAria(my.lyr.bg, 0, 0, $SP.winW, $SP.winH, 0, {clr:"rgba(0, 0, 0, 0.5)"});

    // 背景
    ilstApp.utl.drwAria(this.cntxt, this.x, this.y, this.w, this.h, 0,
       {clr: this.ex.bgClr, isFrm: true, lnW: 1, frmClr: this.ex.ftClr});

    // 画像
    var imgW = this.w * 0.9;
    var imgH = imgW;

    if (cont.img != null) {
      // 画像がある場合表示
      ilstApp.R.drwImg({
         id: cont.img
        ,cntxt: this.cntxt
        ,dx: this.x + (this.w - imgW) / 2
        ,dy: this.y + this.w * 0.05
        ,dw: imgW
        ,dh: imgH
      })
    } else {
      // 画像がない場合
    }

    // 中央ライン
    ilstApp.utl.drwLine(this.cntxt, this.x, this.y + this.w, this.w, "v",
      {lnW: "2px", clr: this.ex.ftClr});

    // タイトル
    ilstApp.utl.drwStr(this.cntxt, cont.ttl, this.x + this.w / 2, this.y + this.w + (this.h - this.w) * 0.15, {
       fillStyle: this.ex.ftClr
      ,wMax: this.w * 0.8
      ,lineWidth: 2
    });

    // 内容
    ilstApp.utl.drwStr(this.cntxt, cont.txt, this.x + this.w / 2, this.y + this.w + (this.h - this.w) * 0.3, {
      fillStyle: this.ex.ftClr
     ,wMax: this.w * 0.8
     ,font: "15px Alegreya Sans SC"
     ,lineWidth: 1
   });

    // 目次
    var pgLen = this.ex.pg.length;
    var lstTocX = this.x + this.w / 2 + (this.ex.tocR * (pgLen - 1) * 3) / 2 + this.ex.tocR;

    // ページ数分描画
    for (var i = 0; i < pgLen; i++) {
      var opt = {clr: this.ex.ftClr};

      if (i != this.ex.pgNow) {
        // 見ていないページ
        opt = {clr: "rgba(0, 0, 0, 0)", isFrm: true, frmClr: this.ex.ftClr};
      }
      // 自動レイアウトして描画
      ilstApp.utl.drwCircle(this.cntxt,
         this.x + (this.w - (this.ex.tocR * (pgLen - 1) * 3)) / 2 + (this.ex.tocR * i * 3), this.y + this.h * 0.95, this.ex.tocR, opt);
    }

    // ボタン
    this.ex.btnX = this.x + (this.w + (lstTocX - this.x)) / 2 - this.ex.btnW / 2;
    this.ex.btnY = (this.y + this.h - this.ex.btnH) * 0.98;
    var btnStr;
    if (this.ex.pgNow == pgLen - 1) {
      // CAT ボタン
      btnStr = "get Started";
    } else {
      // NEXT ボタン
      btnStr = "next";
    }

    ilstApp.utl.drwBtn(this.cntxt, this.ex.btnX, this.ex.btnY, this.ex.btnW, this.ex.btnH, 0, btnStr,
       {bgClr: this.ex.ftClr
      , ftClr: this.ex.bgClr});
  };

  // イベント
  evnt(e) {
    // タップ判定
    if (e.typ != "tap") return false;
    if (! isRng({x: this.ex.btnX, y: this.ex.btnY, w: this.ex.btnW, h: this.ex.btnH}, e)) {return false;}

    this.ex.tapEvntStrt.apply(this, [this.ex.stat]);
    this.needRender = true;

    return true;
  }
}


// ペンツール メニュー
ilstApp.itemPenToolMnu = class extends ilstApp.itemMnuBase{
  constructor(prm) {
    super(
      cmb(true, {
         typ: "menu"
        ,ex: {
           toolTyp: "pen"
          ,mnuTtl: "PEN TOOL'S"

          ,tapEvntStrt: function(rct, btn, i) {
            var $SP = ilstApp.$SP;
            var toolTyp = this.ex.toolTyp;

            // タイトルを押した場合
            if (i == 0) {
              // 使用ツールを上書き
              $SP.cnvsOpt.tool = toolTyp;

              ilstApp.$SP.sm.currentState.itms[0].needRender = true;
              ilstApp.$SP.sm.currentState.itms[1].needRender = true;
            } else {
              // ボタンを押した場合

              // ツール情報を上書き
              cmb(true, $SP.toolOpt[toolTyp].opt, btn.opt);
              $SP.toolOpt[toolTyp].name = btn.name;
            }
            this.needRender = true;
          }

          ,boxClr: ["#999999", "#91e0ff"]
          ,sleClr: "skyblue"    //  ツールが選択されているとき
          ,sleBtnClr: "#74b3cc" //  ボタンが選択されているとき

          ,ttlH: 30

          ,lstH: 27
        }
      }, prm)
    );


    // ツールを設定
    var $SP = ilstApp.$SP;
    var btn = this.ex.btnLst[1];
    var toolTyp = this.ex.toolTyp;

    cmb(true, $SP.toolOpt[toolTyp], btn);
    $SP.toolOpt[toolTyp].name = btn.name;
  }

  render() {
    super.render();

    // 背景
    var mrgn = this.mrgn;
    var x = this.x + mrgn;
    var y = this.y + mrgn;
    var w = this.w - mrgn * 2;
    var h = this.h - mrgn * 2;
    var r = this.ex.r;
    ilstApp.utl.drwAria(this.cntxt, x, y, w, h, 0,
       {clr: this.ex.bgClr, isFrm: true, frmClr: this.ex.frmClr});

    // メニュー タイトル
    var ttlH = this.ex.ttlH;
    var ttlW = w - mrgn * 4;
    var ttlY = y + mrgn * 2;
    var ttlX = x + mrgn * 2;
    var ttlBottom = ttlH + ttlY;
    var ttlClr = this.ex.bgClr;
    // ツールが使用されている場合 色を変える
    if (ilstApp.$SP.cnvsOpt.tool == this.ex.toolTyp) ttlClr = this.ex.sleClr;
    ilstApp.utl.drwBtn(this.cntxt, ttlX, ttlY, ttlW, ttlH, 0, this.ex.mnuTtl,
       {bgClr: ttlClr, isFrm: true, frmClr: this.ex.frmClr, ftClr: this.ex.ftClr});

    // タイトルのイベントを追加
    this.setEvntRect(ttlX, ttlY, ttlW, ttlH, this.ex.lyr, 0);

    // ペン リスト
    var btnLst = this.ex.btnLst;
    var lstH = this.ex.lstH;
    for (var i = 0; i < btnLst.length - 1; i++) {
      // ライン
      var lnX = x + w * 0.05;
      var lnY = ttlBottom + lstH * (i+1);
      ilstApp.utl.drwLine(this.cntxt, lnX, lnY, w * 0.9, "v", {clr: this.ex.frmClr});

      // ボックス
      var btn = btnLst[i + 1]
      var boxClr = this.ex.boxClr[btn.stat];
      var boxW = w * 0.9;
      var boxH = lstH - mrgn * 4;
      var boxY = ttlBottom + mrgn * 2 + ((boxH + mrgn * 4) * i);
      // ボタンが選択されている場合 色を変える
      if (ilstApp.$SP.toolOpt[this.ex.toolTyp].name == btn.name && btn.stat == 0) {boxClr = this.ex.sleBtnClr;}
      ilstApp.utl.drwBtn(this.cntxt, lnX, boxY, boxW, boxH, r, btn.name,
         {bgClr: boxClr, isFrm: true, frmClr: this.ex.frmClr, ftClr: this.ex.ftClr, lnW: 1.5});

      // 判定を登録
      this.setEvntRect(lnX, boxY, boxW, boxH, this.ex.lyr, i + 1);
    }
  }
}

// 消しゴムツール　メニュー
ilstApp.itemEreserToolMnu = class extends ilstApp.itemPenToolMnu{
  constructor(prm) {
    super(
      cmb(true, {ex: {
        toolTyp: "ereser"
        ,mnuTtl: "ERESER TOOL'S"
      }}, prm)
    );
  };
}

ilstApp.itemColorPicker = class extends ilstApp.itemMnuBase{
  constructor(prm) {
    super(
      cmb(true, {
         typ: "colorPicker"

        ,ex: {
           ttl: "COLOR PICKER"

          ,rgbPrm: {r: null, g: null, b: null}
          ,rgb: "#000000"
          ,btnLen: 3
          ,btnR: 14
        }
      }, prm)
    );

    var cnvsOpt = ilstApp.$SP.cnvsOpt;

    // 現在のRGBをセットします
    var rgb = this.ex.rgb;
    this.ex.rgbPrm = {
      r: parseInt(rgb.substring(1,3), 16),
      g: parseInt(rgb.substring(3,5), 16),
      b: parseInt(rgb.substring(5,7), 16)
    };
    cnvsOpt.fillStyle = this.ex.rgb;

    // まだ追加されていない場合セット
    var clrLst = cnvsOpt.clrLst;
    if (clrLst[clrLst.length - 1] != this.ex.rgb) {
      cnvsOpt.clrLst.push(this.ex.rgb);
    }
  }

  render() {
    super.render();

    // ボタンのリストを作成します
    if (this.ex.btnLst.length < this.ex.btnLen * 2) {
      for (var i = 0; i < this.ex.btnLen * 2; i++) {
        this.ex.btnLst[i] = {stat: 0};
      }
    }

    // 背景
    var mrgn = this.mrgn;
    var x = this.x + mrgn;
    var y = this.y + mrgn;
    var w = this.w - mrgn * 2;
    var h = this.h - mrgn * 2;
    ilstApp.utl.drwAria(this.cntxt, x, y, w, h, 0, {clr: this.ex.bgClr, isFrm: true, frmClr: this.ex.frmClr});

    // カラーピッカー タイトル
    var prm = this.ex.rgbPrm;
    this.ex.rgb = rgb2hex([prm.r, prm.g, prm.b]);
    var ttlW = w * 0.9;
    var ttlH = h * 0.07;
    var ttlY = y + mrgn * 4;
    var ttlX = x + (w - ttlW) / 2;
    ilstApp.utl.drwBtn(this.cntxt, ttlX, ttlY, ttlW, ttlH, 0, this.ex.ttl,
       {bgClr: this.ex.bgClr, isFrm: true, frmClr: this.ex.frmClr, ftClr: this.ex.ftClr})

    // 現在の色
    var rgbW = w * 0.7;
    var rgbH = rgbW;
    var rgbX = x + (w - rgbW) / 2;
    var rgbY = y + h / 2 - rgbH;
    ilstApp.utl.drwAria(this.cntxt, rgbX, rgbY, rgbW, rgbH, 0, {clr: this.ex.rgb, isFrm: true, frmClr: this.ex.frmClr, lnW: 4});

    // 数値増減ボタン
    var btnR    = this.ex.btnR;
    var btnLen  = this.ex.btnLen;
    var btnW    = btnR * 2;
    for (var i = 0; i < btnLen; i++) {
      // R G B ナビゲーションラベル
      var lblX = I(x + (w - (btnR * (btnLen - 1) * 3)) / 2 + (btnR * i * 3) - btnR / 2);
      var lblY = y + h * 0.75 - btnW * 1.5;
      var lblClr = i == 0 ? "#ff6666" : i == 1 ? "#66ff66" : i == 2 ? "#6666ff": "#000000";
      ilstApp.utl.drwAria(this.cntxt, lblX, lblY, btnR, btnR, 0, {
        clr: lblClr, isFrm: true, frmClr: this.ex.frmClr
      });
        // R G B string
      var rgbStrX = lblX - btnR / 2;
      var rgbStrY =  y + h * 0.55;
      var prm = this.ex.rgbPrm;
      var rgbStr = i == 0 ? prm["r"] : i == 1 ? prm["g"] : i == 2 ? prm["b"]: "#000000";
      ilstApp.utl.drwBtn(this.cntxt, rgbStrX, rgbStrY, btnW, btnR, 0, rgbStr, {
        bgClr: "BLACK", ftClr: "WHITE"
      });

      for (var j = 0; j < 2; j++) {
        // ボタン 自動レイアウトして描画
        var btn = this.ex.btnLst[i + j + i];
        var boxClr = this.ex.boxClr[btn.stat];
        var btnX = x + (w - (btnR * (btnLen - 1) * 3)) / 2 + (btnR * i * 3)
        var btnY = y + h * 0.75 + (btnR * j * 3.5);
        ilstApp.utl.drwCircle(this.cntxt, btnX, btnY, btnR,
          {isFrm: true, frmClr: this.ex.frmClr, clr: boxClr, lnW: 3});
        // 判定を登録
        this.setEvntRect(btnX - btnR, btnY - btnR, btnW, btnW, this.ex.lyr, i + j + i);
      }
    }
  }
}

// カラーリスト アイテム
ilstApp.itemClrLst = class extends ilstApp.itemMnuBase{
  constructor(prm) {
    super(
      cmb(true, {
         typ: "clrLst"

        ,ex: {
           boxClr: ["#999999", "#91e0ff"]

           ,lstLen: 0     //  リストの数
           ,wrpNum: 0     //  リストの折り返し pushボタンで使用

          ,btnW: 30   //  リストの幅
        }
      }, prm)
    );
  }

  render() {
    super.render();

    // 背景
    var mrgn = this.mrgn;
    var x = this.x + mrgn;
    var y = this.y + mrgn;
    var w = this.w - mrgn * 2;
    var h = this.h - mrgn * 2;
    ilstApp.utl.drwAria(this.cntxt, x, y, w, h, 0, {clr: this.ex.bgClr, isFrm: true, frmClr: this.ex.frmClr});

    // カラーリスト ボックス
    var btnW = this.ex.btnW;
    var lstBoxW = w - mrgn * 2;
    var lstBoxH = h - mrgn * 4;
    if (lstBoxH < lstBoxW) {
      // 横長の場合 縦幅を基準に揃える
      lstBoxW = lstBoxH;

      // 端数を切り捨て
      lstBoxW -= lstBoxW % btnW;
      // ボタンが収まる最大まで拡大
      lstBoxW += btnW * I((w - lstBoxW) / btnW);

      // 縦がはみ出ているなら縮小
      lstBoxH -= lstBoxH % btnW;
    } else {
      // 縦長の場合 横幅を基準に揃える
      lstBoxH = lstBoxW;

      lstBoxH -= lstBoxH % btnW;
      lstBoxH += btnW * I((w - lstBoxH) / btnW)

      lstBoxW -= lstBoxW % btnW;
    }

    var lstBoxX = x + (w - lstBoxW) / 2;
    var lstBoxY = y + (h - lstBoxH) / 2;

    // ボックス　描画
    ilstApp.utl.drwAria(this.cntxt,
      lstBoxX, lstBoxY, lstBoxW, lstBoxH, 0, {clr: "#808080", isFrm: true, frmClr: this.ex.frmClr});

    // リスト数を設定
    this.ex.lstLen = lstBoxH / btnW * lstBoxW / btnW;

    var btnLen = lstBoxW / btnW;
    var clrLst = ilstApp.$SP.cnvsOpt.clrLst;

    // ボタンを追加
    for (var bsY = 0; bsY < lstBoxH / btnW; bsY++) {
      for (var bsX = 0; bsX < lstBoxW / btnW; bsX++) {
        var clrNum = btnLen * bsY + bsX;
        var btnLst = this.ex.btnLst;
        var btnClr = this.ex.boxClr[btnLst[clrNum] ? btnLst[clrNum].stat : 0];
        // カラー配列の中身があり ボタンの stat が 0 の場合適応
        if (clrLst.length > clrNum &&  btnClr == this.ex.boxClr[0]) {
          btnClr = ilstApp.$SP.cnvsOpt.clrLst[clrNum];
        };

        var btnX = lstBoxX + btnW * bsX;
        var btnY = lstBoxY + btnW * bsY;

        // ボタン
        if (clrLst.length != clrNum) {
          ilstApp.utl.drwAria(this.cntxt,
            btnX, btnY, btnW, btnW, 0, {clr: btnClr, isFrm: true, frmClr: this.ex.frmClr});
        } else {
          // カラー 追加ボタン
          ilstApp.utl.drwBtn(this.cntxt,
            btnX, btnY, btnW, btnW, 0, "push", {bgClr: btnClr, isFrm: true, frmClr: this.ex.frmClr, ftClr: this.ex.ftClr});
        }

        // カラーが指定されている場合 イベントを追加
        if (clrLst.length > clrNum) {
          this.setEvntRect(btnX, btnY, btnW, btnW, this.ex.lyr, clrNum);
        }

        // カラー 追加ボタン
        if (clrLst.length == clrNum) {
          // 最後尾に追加
          this.setEvntRect(btnX, btnY, btnW, btnW, this.ex.lyr, clrNum);
        }
      }
    }
  }
}

// ファイル オプション
ilstApp.itemFileOpt = class extends ilstApp.itemMnuBase{
  constructor(prm) {
    super(
      cmb(true, {
         typ: "mnue"
        ,ex: {
           mnuTtl: "FILE"
        }
      }, prm)
    );

  }

  render() {
    super.render();

    // キャンバス オプション 背景
    var mrgn = this.mrgn;
    var flOptX = this.x + mrgn;
    var flOptY = this.y + mrgn;
    var flOptW = this.w - mrgn * 2;
    var flOptH = this.h - mrgn * 2;
    ilstApp.utl.drwAria(this.cntxt, flOptX, flOptY, flOptW, flOptH, 0,
       {clr: this.ex.bgClr, isFrm: true, frmClr: this.ex.frmClr});

    // オプション タイトル
    var ttlX = flOptX + mrgn;
    var ttlY = flOptY + mrgn;
    var ttlW = flOptW * 0.1;
    var ttlH = flOptH - mrgn * 2;
    ilstApp.utl.drwBtn(this.cntxt, ttlX, ttlY, ttlW, ttlH, 0, this.ex.mnuTtl,
       {bgClr: this.ex.bgClr, isFrm: true, frmClr: this.ex.frmClr, ftClr: this.ex.ftClr});

    // ボタン
    var btnLst = this.ex.btnLst;
    for (var i = 0; i < btnLst.length; i++) {
      var btn = btnLst[i];
      var boxClr = this.ex.boxClr[btn.stat];
      var btnH = ttlH * 0.8;
      var btnW = ttlW;
      var btnX = ttlX + ttlW + mrgn * 2 + ((btnW + mrgn * 2) * i);
      var btnY = flOptY + flOptH - btnH * 1.25 + mrgn / 2;
      ilstApp.utl.drwBtn(this.cntxt, btnX, btnY, btnW, btnH, this.ex.r, btn.name,
         {bgClr: boxClr, isFrm: true, frmClr: this.ex.frmClr, ftClr: this.ex.ftClr, lnW: 1});
      // 判定を登録
      this.setEvntRect(btnX, btnY, btnW, btnH, this.ex.lyr, i);
    }
  };
}

// キャンバス オプション
ilstApp.itemCnvsOpt = class extends ilstApp.itemFileOpt{
  constructor(prm) {
    super(
      cmb(true, {
         typ: "menu"

        ,ex: {
           mnuTtl: "CANVAS"
        }
      }, prm)
    );
  };
}

// キャンバスを作成します
ilstApp.itemCnvs = class extends ilstApp.itemMnuBase{
  constructor(prm) {
    super(
      cmb(true, {
         typ: "canvas"
        ,needUpdate: false
        ,accptEvnt: true

        ,ex: {
           evntlst: []
          ,isDrawed: false  //  描画中かどうかのフラグ
          ,lyr: false       //  メインレイヤーの場合
        }
      }, prm)
    );

    // レイアウトを設定
    // リサイズイベント を利用して レイアウトとイベントを登録
    this.resizeEvnt();
  }

  evnt(e) {
    // マウス アウト
    if (e.typ == "move" && this.ex.isDrawed) {
      if (! isRng(this.ex.evntLst[0], e)) {
        // 描画を終了
        this.mouseUp(e);
        return true;
      }
    }

    // 受付対象外
    if (! isRng(this.ex.evntLst[0], e)) return false;

    // キャンバスのスクロール分減算
    var $SP = ilstApp.$SP;
    var cnvsOpt = $SP.cnvsOpt;
    e.x -= cnvsOpt.cnvsScrX;
    e.y -= cnvsOpt.cnvsScrY

    // マウス タップ
    if (e.typ == "tap") {
      this.mouseDown(e);
      return true;
    }

    // マウス ムーブ
    if (e.typ == "move") {
      this.mouseMove(e);
      return true;
    }

    // マウス アップ
    if (e.typ == "up") {
      this.mouseUp(e);
      return true;
    }

    return false;
  };

  mouseDown(e) {
    // 現在のマウスの座標を追加
    var $SP = ilstApp.$SP;
    var evntOpt = $SP.evntOpt;

    // ドロー状態を true に
    this.ex.isDrawed = true;

    // マウスの座標を追加
    evntOpt.points.push(ilstApp.cnvsUtl.clcMousePosition(e));
  }

  mouseMove(e) {
    var $SP = ilstApp.$SP;
    var toolOpt = $SP.toolOpt;
    var cnvsOpt = $SP.cnvsOpt;
    var evntOpt = $SP.evntOpt;
    var tool = toolOpt[cnvsOpt.tool];

    var cnvs = $SP.cnvsOpt.tmp_cnvs;
    var cntxt = $SP.cnvsOpt.tmp_cntxt;
    var points = ilstApp.$SP.evntOpt.points;

    // マウスの座標を追加
    points.push(ilstApp.cnvsUtl.clcMousePosition(e));

    cntxt.clearRect(0, 0, cnvs.width, cnvs.height);

    // ポイントが3つ以上ない場合 次の座標を指定できないので円で代用
    if(points.length < 3) {
      var point = points[0];
      cntxt.beginPath();
      cntxt.arc(point.x, point.y, toolOpt.pen.opt.lineWidth / 2, 0, Math.PI * 2, true);
      cntxt.fillStyle = cnvsOpt.fillStyle;
      cntxt.fill();
      cntxt.closePath();

      return;
    }

    // 開始位置
    cntxt.beginPath();
    cntxt.moveTo(points[0].x, points[0].y);

    // 2次元ベジェ曲線で描画
    var i;
    for (i = 1; i < points.length - 2; i++) {
      var cpx = (points[i].x + points[i + 1].x) / 2;
      var cpy = (points[i].y + points[i + 1].y) / 2;
      cntxt.quadraticCurveTo(points[i].x, points[i].y, cpx, cpy);
    }

    cntxt.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);

    // コンテキストのスタイル適応
    cntxt.strokeStyle = cnvsOpt.fillStyle;
    cntxt.lineWidth = tool.opt.lineWidth;
    cntxt.lineJoin = tool.opt.lineJoin;
    cntxt.lineCap  = tool.opt.lineCap;

    // 使用ツールが ereser の場合 線の色を変える
    cntxt.save();
    if (cnvsOpt.tool == "ereser") {
      cntxt.strokeStyle = "rgba(152, 251, 152, 0.6)";
    };

    cntxt.stroke();

    cntxt.restore();
  }

  mouseUp(e) {
    var $SP = ilstApp.$SP;
    var cnvsOpt = $SP.cnvsOpt;
    var mainCntxt = cnvsOpt.cntxt;
    var cntxt = cnvsOpt.tmp_cntxt;

    // ドロー状態を false に
    this.ex.isDrawed = false;

    // 使用ツールが ereser の場合描画した切り抜きモードに
    mainCntxt.save();
    if (cnvsOpt.tool == "ereser") {
      cntxt.stroke();
      mainCntxt.globalCompositeOperation = "destination-out";
    };

    // tmp_cntxtをメインキャンバスにコピー
    mainCntxt.drawImage(cntxt.canvas, 0, 0);

    mainCntxt.restore();

    cntxt.clearRect(0, 0, cntxt.canvas.width, cntxt.canvas.height);
    $SP.evntOpt.points = [];
  };

  resizeEvnt() {

    var $SP = ilstApp.$SP;
    var cnvsOpt = $SP.cnvsOpt;
    var lyr = this.ex.lyr;
    var clientRect = lyr.tgtEle.getBoundingClientRect();
    var width = clientRect.width;
    var height = clientRect.height;;
    var x = clientRect.x;
    var y = clientRect.y;

    // レイアウトを設定
    ilstApp.cnvsUtl.cnvsLayout(this.ex.lyr);

    this.ex.evntLst = [];

    // レイアウトで中央寄せにされた場合 レイアウト分加算
    this.x = Math.max(0, $SP.cnvsOpt.cnvsX + $SP.cnvsOpt.cnvsScrX);
    this.y = Math.max(y, $SP.cnvsOpt.cnvsY + $SP.cnvsOpt.cnvsScrY);

    // イベント対象範囲を メインエリア 内に収める
    var left = Math.max(0, $SP.cnvsOpt.cnvsX + $SP.cnvsOpt.cnvsScrX - x);
    var right = Math.max(0, width - ($SP.cnvsOpt.cnvsX + $SP.cnvsOpt.cnvsScrX - x + $SP.cnvsOpt.cnvsW));

    this.w = width - left - right;
    this.h = Math.min(height, height - $SP.cnvsOpt.cnvsScrY, $SP.cnvsOpt.cnvsH + $SP.cnvsOpt.cnvsScrY, $SP.cnvsOpt.cnvsH);

    // イベントを追加
    this.ex.evntLst[0] = {x: this.x, y: this.y, w: this.w, h: this.h};
  }
}
