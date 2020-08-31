/**
 * アプリのシーンはこのStateを継承して作成します
 * @class 派生したStateの継承元です
 */

ilstApp.State = class {
  /**
   * Stateのプロパティを初期化
   * @constructor
   * @param {Object} prm 上書きする拡張用プロパティ
   */
  constructor(prm) {
    this.name = "State";
    this.itms = [];           //  描画アイテム配列
    this.nxtState = null;     //  次のシーン

    cmb(true, this, prm);
  };

  // 入室
  enter() {
    this.nxtState = null;
    this.itemLst = [];
  };

  // 実行
  exec() {
  };

  // レンダー(入室/実行/退出)
  renderEnter() {
  };
  renderExec() {
    this.actItemRender();
  };
  renderLeave() {};

  // アップデート(入室/実行/退室)
  updatePreEnter() {};
  updateEnter() {};
  updatePreExec() {};
  updateExec() {
    this.actItemUpdate();
    return this.needsTransition();
  };
  updateLeave() {};

  /**
  * nxtStateに次のシーンが格納されている場合状態遷移を行います
  * @return {Boolean} 状態帰還が必要であるか否か
  */
  needsTransition() {
    var $SP = ilstApp.$SP;
    if (this.nxtState) {
      $SP.sm.transition(this.nxtState);
      return true;
    }
    return false;
  };

  // 描画アイテムのレンダー呼び出し
  actItemRender() {
    for (var i = 0; i < this.itms.length; i++) {
      // 処理の途中で設定されれば終了
      if (this.nxtState != null) return;

      var itm = this.itms[i];
      if (itm.needRender) {itm.render();}
    }
  };

  // 描画アイテムのアップデート呼び出し
  actItemUpdate() {
    for (var i = 0; i < this.itms.length; i++) {
      // 処理の途中で設定されれば終了
      if (this.nxtState != null) return;

      var itm = this.itms[i];
      if (itm.needUpdate) {itm.update();}
    }
  };

  // 描画アイテムのイベント呼び出し
  actItemEvnt(evnt) {
    //  次の状態が設定されている場合終了
    if (this.nxtState != null) return;

    var $SP = ilstApp.$SP;
    var lyrs = $SP.lyrs;
    var mainLyrs = $SP.mainLyrs;

    outer: for (var i = lyrs.length; i--;) {
      // 上位レイヤーから順に判定
      var tgtCntxt = lyrs[i].cntxt;

      for (var j = 0; j < this.itms.length; j++) {
        var item = this.itms[j];

        if (! item.accptEvnt) {continue;}

        if (item.cntxt != tgtCntxt) {continue;}

        // trueを返せば終了
        if (item.evnt(evnt)) {break outer;}
      }
    }
  };

}

/**
 * Stateを管理して登録するオブジェクトです
 * @param {[]}
 */
ilstApp.StateLst = function() {
  this.stateLst = [];
  this.frstNm   = null;   // 開始状態

  this.add = function(state) {
    var nm = state.name;
    this.stateLst[nm] = state;
    if (this.frstNm == null) {this.frstNm = nm;}
  };

  this.getLst = function() {
    return this.stateLst;
  }

  this.getFrstNm = function() {
    return this.frstNm;
  }
};
