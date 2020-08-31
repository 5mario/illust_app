/**
 * シーン遷移 イベントの管理を行います
 */

ilstApp.StateMachine = function() {
  this.states = null;         // state のリスト
  this.currentState   = null;
  this.nxtState       = null;
  this.currentStateNm = null;
  this.nxtStateNm     = null;
  this.phase = null;          // state の状態(フェーズ)

  this.suspendState = false;  // 一時停止のフラグ
  this.accptEvnt = true;      // event の受付可否

  /**
   * main.js で作成したアプリ状態を登録します
   * イベントの登録も行います
   * @constructor
   * @param  {Object} prm {states, currentStateNm}
   */
  this.constructor = function(prm) {
    var $SP = ilstApp.$SP;
    var cnvsTop = $SP.lyrTap.cnvs;
    var $this = this;

    // state リストを登録
    this.states = prm.states;

    // ウィンドウ リサイズイベントを登録
    window.addEventListener("resize", function() {
      // サイズを取得
      $SP.winW = window.innerWidth;
      $SP.winH = window.innerHeight;

      // サイズ 再設定
      // tmp_cnvs の幅は再設定しない
      for (var i = 0; i < $SP.lyrs.length - 1; i++) {
        var lyr = $SP.lyrs[i];
        var cnvs = lyr.cnvs;
        var tgtEle = lyr.tgtEle;

        // メインキャンバスのサイズは変更しない
        if (lyr.cnvsId == "cnvsMain" && $SP.cnvsOpt.lyr != null) continue;

        // 親要素がある場合親要素の幅を適応させる
        var clientRect;
        if(tgtEle) {
          clientRect = tgtEle.getBoundingClientRect();
        }

        var style = cnvs.style;

        // レイヤー設定
        cnvs.setAttribute("width" , tgtEle ? clientRect.width  + "px" : $SP.winW + "px");
        cnvs.setAttribute("height", tgtEle ? clientRect.height + "px" : $SP.winH + "px");
        style.position = "absolute";
        style.left = tgtEle ? clientRect.left + "px": "0px";
        style.top =  tgtEle ? clientRect.top  + "px": "0px";
      }

      // レンダーを有効に
      var itms = $this.currentState.itms;
      for (var i = 0; i < itms.length; i++) {
        var itm = itms[i];
        itm.resizeEvnt();
      }

      // state のリサイズイベントを呼び出し
      $this.currentState.resizeEvnt();
    });

    // マウスダウン イベントを登録
    cnvsTop.addEventListener("mousedown", this.handleDown);

    // マウス移動　イベントを登録
    cnvsTop.addEventListener("mousemove", this.handleMove);

    // マウスアップ イベントを登録
    cnvsTop.addEventListener("mouseup",   this.handleUp);

    // フェーズを更新
    this.transition(prm.currentStateNm);
  };

  /**
   * シーンを遷移します
   * @param  {StringorObject} nextStateNm 次のシーン
   */
  this.transition = function(nextStateNm) {
    if (this.currentState == null) {
      // 初回処理
      this.currentState = this.states[nextStateNm];
      this.currentStateNm = nextStateNm;
      this.phase = "preEnter";
    }  else {
      // 2回目以降
      this.nxtState = this.states[nextStateNm];
      this.nxtStateNm = nextStateNm;
      this.phase = "leave";
    }
  };

  /**
   * State の phase に対応する Render を呼び出します
   * @param {}
   */
  this.render = function() {
    var $SP = ilstApp.$SP;
    var phs = this.phase;
    var stt = this.currentState;

    // 時間を更新
    if (! $SP.tmEnbl) return;
    ilstApp.tm.update("render");

    // 対応する render 呼び出し
    if (phs == "enter") {stt.renderEnter();} else
    if (phs == "exec")  {stt.renderExec();} else
    if (phs == "leave") {stt.renderLeave();}
  };

  /**
   * State の phase に対応する Update を呼び出します
   * また実行した update の戻り値が true の場合フェーズを遷移します
   * @param {}
   */
  this.update = function() {
    // 時間を更新
    ilstApp.tm.update("update");

    var nxt;          //  戻り値を保存します
    var updates = [
          {nm: "preEnter",  fnc: "updatePreEnter"}
        , {nm: "enter",     fnc: "updateEnter"}
        , {nm: "preExec",   fnc: "updatePreExec"}
        , {nm: "exec",      fnc: "updateExec"}
        , {nm: "leave",     fnc: "updateLeave"}
      ];
    // 対応する update 呼び出し
    for (var i = 0; i < updates.length; i++) {
      if (this.phase != updates[i].nm) continue;

      // 戻り値が true の場合 フェーズを遷移します
      if (nxt = this.currentState[updates[i].fnc]()) {
        this.phase = updates[(i + 1) % updates.length].nm;
        break;
      }
    }

    // フェーズ遷移時に呼び出し
    if (nxt) {
      ilstApp.tm.reset("phase");

      if (this.phase == "preEnter") {
        this.currentState = this.nxtState;
        this.currentStateNm = this.nxtStateNm;
        this.nxtState = null;
      }

      if (this.phase == "enter") {
        this.currentState.enter();
      };

      if (this.phase == "exec") {
        this.currentState.exec();
      };
    }
  };

  // マウスダウン 処理
  this.handleDown = function(evt) {
    var $SP = ilstApp.$SP;
    var evntOpt = $SP.evntOpt;

    // 押下状態に
    evntOpt.isMousePushed = true;

    var e = $SP.sm.getMousePosition(evt);
    var evntPrm = {typ: "tap", x: e.x, y: e.y};

    // イベント呼び出し
    $SP.sm.currentState.actItemEvnt(evntPrm);
  }

  // マウス移動 処理
  this.handleMove = function(evt) {
    var $SP = ilstApp.$SP;
    var evntOpt = $SP.evntOpt;

    // ドロップしていない場合は終了
    if (! evntOpt.isMousePushed) return;

    // 座標を取得
    var e = $SP.sm.getMousePosition(evt);

    var evntPrm = {typ: "move", x: e.x, y: e.y};

    // イベント呼び出し
    $SP.sm.currentState.actItemEvnt(evntPrm);
  }

  // マウスアップ 処理
  this.handleUp = function(evt) {
    var $SP = ilstApp.$SP;
    var evntOpt = $SP.evntOpt;

    evntOpt.isMousePushed = false;

    var e = $SP.sm.getMousePosition(evt);
    var evntPrm = {typ: "up", x: e.x, y: e.y};

    // イベント呼び出し
    $SP.sm.currentState.actItemEvnt(evntPrm);
  }

  // 座標を取得して返します
  this.getMousePosition = function(evt) {
    return {
      x: evt.clientX,
      y: evt.clientY
    };
  }

  // 構築開始
  this.constructor.apply(this, arguments);
};
