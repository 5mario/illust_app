/*
アプリの初期化処理をまとめてあります
 */

//  object for name space
var ilstApp = function() {};

//  環境変数として使用
ilstApp.$SP = {};

/**
 * システム パラメータを初期化します
 * @param  {object} prm システム パタラメータの初期値
 */
ilstApp.initPrm = function(prm) {
  var $SP = ilstApp.$SP;

  $SP.wrpDom =
    document.getElementById(prm.wrpId); //  レイヤーのラップ要素
  $SP.wrpId = prm.wrpId;          //  ラップ要素のId
  $SP.winW = window.innerWidth;   //  ウィンドウの高さ
  $SP.winH = window.innerHeight;  //  ウィンドウの幅
  $SP.device = "unknown";
  $SP.lyrNo  = prm.lyrNo;         //  固有のレイヤー数
  $SP.lyrTop = prm.lyrNo - 1;
  $SP.lyrHeader = null;           //  レイヤー ヘッダー
  $SP.lyeMain   = null;           //  レイヤー メイン
  $SP.lyeRBer   = null;           //  レイヤー ライトバー
  $SP.lyrLBer   = null;           //  レイヤー レフトバー
  $SP.lyrFooter = null;           //  レイヤー フッター
  $SP.lyrTap    = null;           //  レイヤー タップ
  $SP.lyrs      = [];             //  固有レイヤー 配列
  $SP.mainLyrs  = [];             //  メインのレイヤー 配列
  $SP.toolOpt = {                 //  ツール情報
       pen: null        //  ペン
      ,ereser: null     //  消しゴム
    };
  $SP.cnvsOpt = {           //  キャンバス 情報
       tool: "pen"          //  使用ツール
      ,lyr: null            //  レイヤー
      ,cnvs: null           //  キャンバス
      ,cntxt: null          //  コンテキスト
      ,cnvsX: 0             //  キャンバス 座標X
      ,cnvsY: 0             //  キャンバス 座標Y
      ,cnvsW: 700           //  キャンバスサイズ
      ,cnvsH: 700           //  キャンバスサイズ
      ,cnvsScrX: 0          //  キャンバスのスクロール値
      ,cnvsScrY: 0          //  キャンバスのスクロール値
      ,tmp_cnvs: null       //  仮想キャンバス
      ,tmp_cntxt: null      //  仮想コンテキスト
      ,clrLst: ["#ff3333", "#33ff33", "#3333ff", "#1a1a1a", "#4d4d4d", "#ffffff",
                "#00aaff", "#00ffff", "#ff1a40", "#ff3333", "#96ff2e", "#88ff4d",
                "#faf0e6", "#f8f8ff", "#ffb6c1", "#ff8093", "#ff66c9", "#ff33ff"]           //  カラー配列
      ,fillStyle: "BLACK"   //  線の色
    };
  $SP.evntOpt = {           //  イベント 情報
     isMousePushed: false   //  マウスが押下されているかのフラグ
    ,points: []             //  マウスが動かされた座標 配列
  }
  $SP.tm = {whole: null, phase: null};  //  全体とフェーズ内の時間
  $SP.tmEnbl = false;                   //  時間有効
}

/**
 * アプリを初期化します
 * @param  {object} prm システム パラメータの初期値
 */
ilstApp.init = function(prm) {
  // 環境変数を初期化
  ilstApp.initPrm(prm);

  // ツール情報を初期化
  ilstApp.initTool();

  // スクロールを禁止
  document.body.style.overflow = "hidden";

};

// レイヤー
ilstApp.lyr = function() {};

// レイヤー初期化
ilstApp.lyr.init = function() {
  var $SP = ilstApp.$SP;

  // 固有レイヤー 初期化
  $SP.lyrs = [];
  for (var i = 0; i < $SP.lyrNo; i++) {
    $SP.lyrs.push(this.mkLyr($SP.wrpId + "_cnvs_" + i));
  }

  // メイン レイヤー
  $SP.lyrMain = this.mkLyr("cnvsMain",
    document.querySelector("main"));
  $SP.lyrs.push($SP.lyrMain);
  $SP.mainLyrs.push($SP.lyrMain);

  // ヘッダー レイヤー
  $SP.lyrHeader = this.mkLyr("cnvsHeader",
    document.querySelector("header"));
  $SP.lyrs.push($SP.lyrHeader);
  $SP.mainLyrs.push($SP.lyrHeader);

  // ライト レイヤー
  $SP.lyrRMnu = this.mkLyr("cnvsRBer",
    document.getElementById("rMnu"));
  $SP.lyrs.push($SP.lyrRMnu);
  $SP.mainLyrs.push($SP.lyrRMnu);


  // レフト レイヤー
  $SP.lyrLMnu = this.mkLyr("cnvsLBer",
    document.getElementById("lMnu"));
  $SP.lyrs.push($SP.lyrLMnu);
  $SP.mainLyrs.push($SP.lyrLMnu);

  // フッター レイヤー
  $SP.lyrFooter = this.mkLyr("cnvsFooter",
    document.querySelector("footer"));
  $SP.lyrs.push($SP.lyrFooter);
  $SP.mainLyrs.push($SP.lyrFooter);


  // 固有レイヤーの z-index を上位に
  // ダイヤログやフェードイン/アウトを表示するため
  var zIndexBs = 1000;
  for (var i = 0; i < $SP.lyrNo; i++) {
    $SP.lyrs[i].cnvs.style.zIndex = ++zIndexBs;
  }

  // タップ レイヤー
  // z-index を最上位に
  $SP.lyrTap = this.mkLyr("cnvsTap");
  $SP.lyrs.push($SP.lyrTap);
  $SP.lyrTap.cnvs.style.zIndex = ++zIndexBs;
}

/**
 * キャンバスを作成します
 * @param  {string} cnvsId キャンバスのid
 * @param  {object} tgtEle 追加先の要素
 */
ilstApp.lyr.mkLyr = function(cnvsId, tgtEle) {
  var $SP = ilstApp.$SP;

  // レイヤー作成
  var cnvs = document.createElement("canvas");
  var cntxt = cnvs.getContext("2d");

  // 親要素の位置情報
  var clientRect;
  if(tgtEle) {
    clientRect = tgtEle.getBoundingClientRect();
  }

  // ラップ要素に追加
  $SP.wrpDom.appendChild(cnvs);

  var style = cnvs.style;

  // レイヤー設定
  cnvs.id = cnvsId;
  cnvs.setAttribute("width" , tgtEle ? clientRect.width  + "px" : $SP.winW + "px");
  cnvs.setAttribute("height", tgtEle ? clientRect.height + "px" : $SP.winH + "px");
  style.position = "absolute";
  style.left = tgtEle ? clientRect.left + "px": "0px";
  style.top =  tgtEle ? clientRect.top  + "px": "0px";

  var lyr = {cnvsId, cnvs, cntxt, tgtEle};
  return lyr;
}

// 時間
ilstApp.tm = function() {};

/**
 * 時間は whole(全体) と phase(フェーズ内) を初期化します
 * @param
 */
ilstApp.tm.init = function() {
  var $SP = ilstApp.$SP;

  $SP.tmEnbl = true;

  // 時間のパラメーター
  var TmPrm = function() {
    var TmPrmIn = function() {
      this.sum = 0;     //  合計
      this.elps = 0;    //  前回からの差分時間
      this.old = 0;     //  前回の時間
    }

    this.render = new TmPrmIn();    //  レンダー
    this.update = new TmPrmIn();    //  アップデート
  };

  $SP.tm.whole = new TmPrm();
  $SP.tm.phase = new TmPrm();
};

/**
 * 時間の sum と old を現在の時間にリンクさせ リセットを行います
 * @param  {string} key whole or phase
 */
ilstApp.tm.reset = function(key) {
  var $SP = ilstApp.$SP;
  var now = getTime();

  $SP.tm[key].update.old = $SP.tm[key].render.sum = now;
  $SP.tm[key].update.sum = $SP.tm[key].render.sum = 0;

  // タイムアウトをリセット
  this.resetTimeout(key);
};

// ストップ
ilstApp.tm.stop = function() {
  var $SP = ilstApp.$SP;
  $SP.tnEnbl = false;
};

// スタート
ilstApp.tm.start = function() {
  var $SP = ilstApp.$SP;
  $SP.tmEnbl = true;
  var now = getTime();

  for (var key in $SP.tm) {
    // 古い時間を現在の時間に設定
    $SP.tm[key].update.old = $SP.tm[key].render.old = now;
  }
};

/**
 * 時間の更新とタイムアウトの実行を行います
 * @param  {string} typ update or render
 */
ilstApp.tm.update = function(typ) {
  var $SP = ilstApp.$SP;
  if (! $SP.tmEnbl) return;

  var now = getTime();

  for (var key in $SP.tm) {
    var tm = $SP.tm[key][typ];
    tm.elps = now - tm.old;   //  前回の差分
    tm.sum += tm.elps;        //  前回の差分を加算
    tm.old = now;             //  前回の時間
  }

  // アイムアウトを実行
  ilstApp.tm.chckTimeout();
}

// タイムアウト配列
ilstApp.timeoutArr = [];

/**
 * タイムアウトを追加します
 * @param  {function} fnc 実行する関数
 * @param  {number}   tm  タイマーが待つべき時間
 * @param  {string}   key whole or phase
 * @param  {string}   typ update of render
 */
ilstApp.tm.setTimeout = function(fnc, tm, key, typ) {
  var $SP = ilstApp.$SP;
  var t = $SP.tm[prm.key][prm.typ];
  var sum = t.sum;

  this.timeoutArr.push({fnc: fnc, tm: tm + sum, key: key, typ: typ});
}

ilstApp.tm.chckTimeout = function() {
  var $SP = ilstApp.$SP;
  var arr = ilstApp.timeoutArr;

  for (var i = arr.length; i--;) {
    var dat = arr[i];
    var t = $SP.tm[dat.key][dat.typ];
    var sum = t.sum;

    // 指定した時間が経過すれば実行
    if (sum > dat.tm) {
      dat.fnc();            //  実行
      arr.splice(i, 1);     //  タイムアウトの削除
    }
  }
};

/**
 * 指定したタイムアウトを削除します
 * @param  {String} key whole of phase
 */
ilstApp.tm.resetTimeout = function(key) {
  var $SP = ilstApp.$SP;
  var arr = ilstApp.timeoutArr;

  for (var i = arr.length; i--;) {
    var dat = arr[i]

    if (key == dat.key) {arr.splice(i, 1);}   //  キーが同じなら削除
  }
};

ilstApp.initTool = function() {
  var $SP = ilstApp.$SP;
  // ツール情報の初期化
  var toolPrm = function() {
    this.opt = {
      lineWidth: 2         //  線の太さ
     ,lineJoin: "round"    //  線の折れ曲がる形状
     ,lineCap: "round"     //  線の末端形状
    };

    this.name = null;
  }
  $SP.toolOpt.pen    = new toolPrm();
  $SP.toolOpt.ereser = new toolPrm();
}
