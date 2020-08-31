/**
 * リソースの操作をまとめたオブジェクトです
 */

ilstApp.R = new function() {
  this.bsUrl = "";      //  ベース URL
  this.dlArr = [];      //  リソース配列
  this.dlNow = 0;       //  リソースダウンロード現在位置
  this.isLdng = false;  //  現在ローディング中か
  this.dlOpt = {};      //  ダウンロード中のコールバック関数

  this.imgHsh = {};     //  画像オブジェクト

  // ベースURLをセット
  this.setBsUrl = function(url) {
    this.bsUrl = url;
  }

  // リソース配列の追加
  this.add = function(fnm, id) {
    var url = this.bsUrl + fnm;

    this.dlArr.push({url, fnm, id});
  };

  // ダウンロード開始 設定
  this.strtDl = function(prm) {
    // ローディング中に設定
    this.isLdng = true;
    this.dlNow = 0;

    this.dlOpt = cmb(true, {
       prgrs: function(dlNow, dlSz, fnm) {}
      ,end:   function(dlNow, dlSz) {}
    }, prm);

    // 初回 コールバック関数呼び出し
    this.dlOpt.prgrs(this.dlNow, this.dlSz, this.dlArr[0].fnm);
    this.execDl();
  }

  // ダウンロードの実行
  this.execDl = function() {
    // ダウンロード終了
    if (this.dlNow >= this.dlArr.length) {
      this.dlOpt.end(this.dlNow, this.dlSz);
      this.isLdng = false;
      return;
    };

    var $this = this;
    var dl = this.dlArr[this.dlNow];

    var img = new Image();
    img.onload = function() {
      // リソース情報
      var dt = {img: img, url: dl.url, fnm: dl.fnm};

      // 登録
      $this.imgHsh[dl.id] = dt;

      $this.dlNow ++;
      var nxt = $this.dlArr[$this.dlNow];
      if (typeof nxt === "undefined") {nxt = dt;}
      // コールバック関数の呼び出し
      $this.dlOpt.prgrs($this.dlNow, $this.dlSz, nxt.fnm);
      $this.execDl();
    }

    img.src = dl.url;
  };

  /**
   * 画像を描画します
   * また 回転や移動を少ないコードで記述するため,画像の中心に原点を移して描画します
   * @param  {string} prm.id リソースのid
   * @param  {object or number} prm.cntxt コンテキスト
   * @param  {number} prm.dx 描画 x
   * @param  {number} prm.dy 描画 y
   * @param  {number} prm.dw 描画 横幅
   * @param  {number} prm.dh 描画 高さ
   * @param  {number} prm.sx 画像 x
   * @param  {number} prm.sy 画像 y
   * @param  {number} prm.sw 画像 横幅
   * @param  {number} prm.sh 画像 高さ
   */
  this.drwImg = function(prm) {
    // 読み込み時は終了
    if (this.isLdng) return;

    var img = this.imgHsh[prm.id].img;
    var cntxt = getLyrCntxt(prm.cntxt);

    // 初期化
    var dw = prm.dw || img.width
    var dh = prm.dh || img.height
    var dx = prm.dx || 0
    var dy = prm.dy || 0

    // 原点を画像の中心へ
    cntxt.save();
    cntxt.translate(dx + dw / 2, dy + dh / 2);

    // 描画
    cntxt.drawImage(img
        ,prm.sx || 0, prm.sy || 0
        ,prm.sw || img.width, prm.sh || img.height
        ,-(dw / 2), -(dh / 2), dw, dh);

    cntxt.restore();
  };
}
