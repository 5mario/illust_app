/**
 * 描画に関するユーティリティファイルです
 */

ilstApp.utl = {

  /**
   * レイヤークリアの関数
   * @param  {object or number} cntxt 対象のコンテキスト or レイヤー番号
   * @param  {object} opt   [省略可能] {x, y, w, h}
   */
   clrCntxt(cntxt, opt) {
     var $SP = ilstApp.$SP;
     cntxt = getLyrCntxt(cntxt);

     // オプション
     opt = cmb({
       x: 0, y: 0, w: $SP.winW, h: $SP.winH
     }, opt);

     cntxt.clearRect(opt.x, opt.y, opt.w, opt.h);
   }

   // 角丸のパスを作成します
  ,rndRct: function(cntxt, x, y, w, h, r) {
    cntxt.beginPath();
    cntxt.moveTo(x + w / 2, y);
    cntxt.arcTo(x, y, x, y + h / 2, r);
    cntxt.arcTo(x, y + h, x + w / 2, y + h, r);
    cntxt.arcTo(x + w, y + h, x + w, y + h / 2, r);
    cntxt.arcTo(x + w, y, x + w / 2, y, r);
    cntxt.closePath();
  }

  // 枠を描画します
  ,drwFrm: function(cntxt, x, y, w, h, r, opt) {
    cntxt = getLyrCntxt(cntxt);
    this.rndRct(cntxt, x, y, w, h, r);

    // 設定
    opt = cmb(true, {
       clr: "WHITE"
      ,lnW: 2
    }, opt);

    cntxt.strokeStyle = opt.clr;
    cntxt.lineWidth = opt.lnW;

    cntxt.stroke();
  }

  // ラインを描画します
  ,drwLine: function(cntxt, x, y, sz, dir, opt) {
    cntxt = getLyrCntxt(cntxt);

    cntxt.beginPath();
    cntxt.moveTo(x, y);

    if (dir == "h") {
      // h - 水平
      cntxt.lineTo(x, y + sz);
    } else {
      // v - 直水
      cntxt.lineTo(x + sz, y);
    }

    // 設定
    opt = cmb({
       clr: "WHITE"
      ,lnW: 2
    }, opt);

    cntxt.strokeStyle = opt.clr;
    cntxt.lineWidth = opt.lnW;

    cntxt.stroke();
  }

  // 指定した範囲を塗りつぶします
  ,drwAria: function(cntxt, x, y, w, h, r, opt) {
    cntxt = getLyrCntxt(cntxt);

    this.rndRct(cntxt, x, y, w, h, r);

    opt = cmb({
       clr: "WHITE"
      ,frmClr: "WHITE"
      ,isFrm: false
      ,lnW: 2
    }, opt);

    // フレームを描画
    if(opt.isFrm) {
      cntxt.strokeStyle = opt.frmClr;
      cntxt.lineWidth = opt.lnW;
      cntxt.stroke();
    }

    cntxt.fillStyle = opt.clr;
    cntxt.fill();
  }

  // ボタンを描画します
  ,drwBtn: function(cntxt, x, y, w, h, r, str, opt) {
    cntxt = getLyrCntxt(cntxt);

    opt = cmb({
       bgClr: "WHITE"
      ,ftClr: "BLACK"
      ,isFrm: false
      ,frmClr: "GRAY"
      ,lnW: 2
    }, opt);

    this.drwAria(cntxt, x, y, w, h, r, {clr: opt.bgClr});
    if (opt.isFrm) {
      this.drwFrm(cntxt, x, y, w, h, r, {clr: opt.frmClr, lnW: opt.lnW});
    }

    var strX = x + w / 2;
    var strY = y + h / 2;
    this.drwStr(cntxt, str, strX, strY, {
        font: "15px a"
      ,fillStyle: opt.ftClr
      ,wMax: w * 0.8
    })
  }

  // 円を描画します
  ,drwCircle: function(cntxt, x, y, r, opt) {
    cntxt = getLyrCntxt(cntxt);

    opt = cmb({
       clr: "WHITE"
      ,frmClr: "WHITE"
      ,isFrm: false
      ,lnW: 1
    }, opt);

    cntxt.beginPath();
    cntxt.arc(x, y, r, 0, Math.PI * 2, false);

    // 枠
    if (opt.isFrm) {
      cntxt.lineWidth = opt.lnW;
      cntxt.strokeStyle = opt.frmClr;
      cntxt.stroke();
    }

    cntxt.fillStyle = opt.clr;
    cntxt.fill();
  }

  /**
   * フェードを描画します
   * @param  {number or object} cntxt レイヤー番号 or cntext
   * @param  {number} trnstTm 遷移時間
   * @param  {string} typ in or out
   */
  ,drwFade: function(cntxt, trnstTm, typ) {
    var $SP = ilstApp.$SP;
    var w = $SP.winW;
    var h = $SP.winH;
    var elps = $SP.tm.phase.render.sum;
    var alph = Math.min(1, elps / trnstTm);
    cntxt = getLyrCntxt(cntxt);

    this.clrCntxt(cntxt);

    cntxt.fillStyle = "BLACK";
    if (typ == "in") {
      cntxt.globalAlpha = 1 - alph;
    } else {
      cntxt.globalAlpha = alph;

    }

    cntxt.fillRect(0, 0, w, h);
    cntxt.globalAlpha = 1;
  }

  // 文字列を描画します
  ,drwStr: function(cntxt, str, x, y, opt) {
    cntxt = getLyrCntxt(cntxt);

    opt = cmb({
       font:         '20px Alegreya Sans SC'
      ,textAlign:    "center"
      ,textBaseline: "middle"
      ,wMax: null
      ,fillStyle:  "#ffffff"
      ,lineWidth:    2
    }, opt);
    cntxt.save();   //  保存

    cntxt.font = opt.font;
    cntxt.textAlign = opt.textAlign;
    cntxt.textBaseline = opt.textBaseline;
    cntxt.fillStyle = opt.fillStyle;
    cntxt.lineWidth = opt.lineWidth;

    cntxt.fillText(str, x, y, opt.wMax);

    cntxt.restore();
  }
};
