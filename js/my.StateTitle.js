/**
 * タイトル画面を実装します
 * 背景を描画して チュートリアル アイテムを登録します
 */

ilstApp.StateTitle = class extends ilstApp.StateBase{
  constructor() {
    // 拡張パラメータ
    var prm = {
       name: "StateTitle"
    };

    super(prm);
  };

  enter() {

    super.enter();

    var $SP = ilstApp.$SP;

    // 背景を描画します

    // 各メインレイヤーの背景色
    for (var i = 0; i < $SP.mainLyrs.length; i++) {
      var tgtEle = $SP.mainLyrs[i];
      var cnvs = tgtEle.cnvs;
      cnvs.style.backgroundColor = "#808080";
      ilstApp.utl.drwFrm(tgtEle.cntxt,
         0, 0, cnvs.width, cnvs.height, 0, {clr: "#666666"});
    }

    // ペンツール
    this.itms.push(new ilstApp.itemPenToolMnu({
       x: 1
      ,y: 1
      ,w: $SP.lyrLMnu.cnvs.width - 2
      ,h: $SP.lyrLMnu.cnvs.height / 2 - 2
      ,cntxt: $SP.lyrLMnu.cntxt

      ,ex: {
         btnLst: [
                  {stat: 0},
                  {name: "Gペン", stat: 0, opt: {lineWidth: 2}},
                  {name: "マーカー", stat: 0, opt: {lineWidth: 4}},
                  {name: "ビックペン", stat: 0, opt: {lineWidth: 7}}]
        ,lyr: $SP.lyrLMnu
      }
    }));

    // 消しゴムツール
    this.itms.push(new ilstApp.itemEreserToolMnu({
       x: 1
      ,y: $SP.lyrLMnu.cnvs.height * 0.5
      ,w: $SP.lyrLMnu.cnvs.width - 2
      ,h: $SP.lyrLMnu.cnvs.height * 0.5 - 2
      ,cntxt: $SP.lyrLMnu.cntxt

      ,ex: {
         btnLst: [
                  {stat: 0},
                  {name: "軟らかめ", stat: 0},
                  {name: "硬め"    , stat: 0},
                  {name: "ビック消しゴム", stat: 0}]
        ,lyr: $SP.lyrLMnu
      }
    }));

    // カラーピッカー
    this.itms.push(new ilstApp.itemColorPicker({
       x: 1
      ,y: 1
      ,w: $SP.lyrRMnu.cnvs.width - 2
      ,h: $SP.lyrRMnu.cnvs.height * 0.7 - 2
      ,cntxt: $SP.lyrRMnu.cntxt

      ,ex: {
         lyr: $SP.lyrRMnu
      }
    }));

    // カラー リスト
    this.itms.push(new ilstApp.itemClrLst({
       x: 1
      ,y: $SP.lyrRMnu.cnvs.height * 0.7
      ,h: $SP.lyrRMnu.cnvs.height * 0.3 - 2
      ,w: $SP.lyrRMnu.cnvs.width - 2
      ,cntxt: $SP.lyrRMnu.cntxt

      ,ex: {
         lyr: $SP.lyrRMnu
        }
    }));

    // ファイル オプション
    this.itms.push(new ilstApp.itemFileOpt({
       x: 1
      ,y: 1
      ,w: $SP.lyrHeader.cnvs.width * 0.5
      ,h: $SP.lyrHeader.cnvs.height - 2
      ,cntxt: $SP.lyrHeader.cntxt

      ,ex: {
         btnLst: [
           {name: "新規", stat: 0},
           {name: "開く", stat: 0},
           {name: "保存", stat: 0},
           {name: "⤻360°", stat: 0}]

        ,lyr: $SP.lyrHeader
      }
    }));

    // キャンバス オプション
    this.itms.push(new ilstApp.itemCnvsOpt({
       x: $SP.lyrFooter.cnvs.width * 0.25
      ,y: 1
      ,w: $SP.lyrFooter.cnvs.width * 0.5
      ,h: $SP.lyrFooter.cnvs.height - 2
      ,cntxt: $SP.lyrFooter.cntxt

      ,ex: {
        btnLst: [
          {name: "拡大", stat: 0},
          {name: "縮小", stat: 0},
          {name: "クリア", stat: 0},
          {name: "↑", stat: 0},
          {name: "↓", stat: 0},
          {name: "→", stat: 0},
          {name: "←", stat: 0}]

       ,lyr: $SP.lyrFooter
      }
    }));

    var w = 315;
    var h = 490;
    var $this = this;

    // ダイヤログ
    this.itms.push(new ilstApp.itemDialog({
       x: $SP.lyrMain.cnvs.width  * 0.525
      ,y: $SP.lyrMain.cnvs.height * 0.1
      ,w: $SP.lyrMain.cnvs.width  * 0.3
      ,h: $SP.lyrMain.cnvs.height * 0.9
      ,cntxt: $SP.lyrs[my.lyr.dlg].cntxt

      ,ex: {
         pg: [{ttl: "はじめましょう。",     txt: "あなたのイラストは360°に動きます。", img: null}
             ,{ttl: "イラストを描きます。", txt: "お好きなツールを使いましょう。",     img: null}
             ,{ttl: "保存をしましょう。",   txt: "右上のボタンを押して保存できます。", img: null}]

        ,tapEvntStrt: function(stat) {
          if(this.ex.pgNow == this.ex.pg.length - 1) {
            // 最後のページ
            $this.nxtState = "StateMain";
          } else {
            // ページを更新
            this.ex.pgNow ++;
          }
        }

        ,lyr: $SP.lyrMain
      }
    }));
  }
}
