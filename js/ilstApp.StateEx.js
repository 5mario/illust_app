/**
 * 遷移時のフェードイン フェードアウト を実装しています
 */

ilstApp.StateBase = class extends ilstApp.State{
  /**
   * フェードイン フェードアウトで使うプロパティを初期化します
   * @constructor
   * @param {object} prm 拡張プロパティ
   */
  constructor(prm) {
    // プロパティを上書き
    super({
       name: "StateBase"
      ,trnstTime: 500     //  遷移時間
    });

    // 拡張プロパティを適応
    cmb(true, this, prm);
  }

  renderEnter() {
    this.renderExec();    //  背景を描画

    // フェードイン
    var $SP = ilstApp.$SP;
    ilstApp.utl.drwFade($SP.lyrTop, this.trnstTime, "in");
  }

  renderLeave() {
    this.renderExec();

    // フェードアウト
    var $SP = ilstApp.$SP;
    ilstApp.utl.drwFade($SP.lyrTop, this.trnstTime, "out");
  }

  // レイヤーをクリアします
  updatePreEnter() {
    var $SP = ilstApp.$SP;
    var lyrs = $SP.lyrs;

    // フェードイン/アウト 固有のファイルをクリア
    for (var i = 0; i < my.lyr.sz - 1; i++) {
      ilstApp.utl.clrCntxt(i);
    }
    return true;
  }

  updatePreExec() {
    var $SP = ilstApp.$SP;

    // フェードレイヤー をクリア
    ilstApp.utl.clrCntxt($SP.lyrTop);

    return true;
  }

  updateEnter() {
    var $SP = ilstApp.$SP;
    var elps = $SP.tm.phase.update.sum;

    // 遷移時間経過 次のフェーズ
    if (elps >= this.trnstTime) {return true;}
    return false;
  }

  updateLeave() {
    var $SP = ilstApp.$SP;
    var elps = $SP.tm.phase.update.sum;

    // 遷移時間経過 次のフェーズ
    if (elps >= this.trnstTime) {return true;}
    return false;
  }

  resizeEvnt() {
    var $SP = ilstApp.$SP;

    // 各メインレイヤーの背景色
    for (var i = 0; i < $SP.mainLyrs.length; i++) {
      var tgtEle = $SP.mainLyrs[i];
      var cnvs = tgtEle.cnvs;
      cnvs.style.backgroundColor = "#808080";
      ilstApp.utl.drwFrm(tgtEle.cntxt,
         0, 0, cnvs.width, cnvs.height, 0, {clr: "#666666"});
    }
  }
};
