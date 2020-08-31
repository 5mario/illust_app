/**
 * 著作権画面を実装します
 * リソースのダウンロードが終了次 第次のフェーズに変異します
 */

ilstApp.StateAuthor = class extends ilstApp.StateBase{
  constructor() {
    super({
       name: "StateAuthsor"

      ,dlEnbl: false    //  リソースのダウンロード終了
    });
  };

  enter() {
    super.enter();

    ilstApp.R.setBsUrl("img/");

    // 登録
    ilstApp.R.add("ilstApp_tutorial_0.png", "tutorial_0");
    ilstApp.R.add("ilstApp_tutorial_1.png", "tutorial_1");
    ilstApp.R.add("ilstApp_tutorial_2.png", "tutorial_2");

    var $this = this;
    // ダウンロード
    ilstApp.R.strtDl({
       end: function() {
         $this.endEnbl = true;    //  終了時 ダウンロード状態を終了へ
       }
    });
  }

  updateExec() {
    if (this.endEnbl) {
      // ダウンロード完了後 次のシーンへ設定
      var $SP = ilstApp.$SP;
      $SP.sm.transition("StateTitle");
      return true;
    }
    return false;
  }
}
