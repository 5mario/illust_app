/**
 * アプリのアップデート レンダーを呼び出します
 */

ilstApp.Engine = function() {
  this.stateMachine = null;           //  stateMachine を介して処理を行う
  this.updateInterval = 1000 / 16;    // 16fps
  var $this = this;

  // 構築子
  this.constructor = function(stateMachine) {
    this.stateMachine = stateMachine;
    var $SP = ilstApp.$SP;
    $SP.sm = stateMachine;

    // アプリ内時間をスタート
    ilstApp.tm.start();

    // 実行
    this.start();
  };

  // エンジン開始
  this.start = function() {
    // レンダー呼び出し
    this.render();

    // アップデートを設定
    this.updateId = setInterval(
       this.update
      ,ilstApp.Engine.updateInterval
    );
  };

  // レンダー
  this.render = function() {
    $this.renderId = requestAnimationFrame($this.render);
    $this.stateMachine.render();
  };

  // アップデート
  this.update = function() {
    $this.stateMachine.update();
  };

  // 構築開始
  this.constructor.apply(this, arguments);
}
