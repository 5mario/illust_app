/**
 * State に登録して利用する item の基本クラスです
 * @class
 */

ilstApp.item = class {
  constructor(prm) {
    this.typ = "item";    //  アイテムのタイプ
    this.stat = 0;        //  アイテムの状態
    this.cntxt = null;    //  対象のコンステキト
    this.ex = null;       //  拡張用パラメータ

    // 描画位置 サイズ
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

    // 描画 更新 が必要かのフラグ
    this.needRender = true;
    this.needUpdate = true;

    // 拡張パラメータを適応
    cmb(true, this, prm);
  };

  // アップデート
  update() {
    if (this.stat == 1) {this.needRender = true;}
  };

  // レンダー
  render() {
    this.needRender = false;
  }

  // イベント
  evnt(e) {
    return false;
  }
}
