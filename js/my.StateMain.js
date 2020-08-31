/**
 * メイン画面を実装します
 */

ilstApp.StateMain = class extends ilstApp.StateBase{
  constructor() {
    super({
       name: "StateMain"
    });
  }

  enter() {
    super.enter();

    var $SP = ilstApp.$SP;

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
                  {name: "ビックペン", stat: 0, opt: {lineWidth: 7}},
                  {name: "ペンキ", stat: 0, opt: {lineWidth: 17}}]
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
                  {name: "軟らかめ", stat: 0, opt: {lineWidth: 15}},
                  {name: "硬め"    , stat: 0, opt: {lineWidth: 7}},
                  {name: "ビック消しゴム", stat: 0, opt: {lineWidth: 23}}]
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
         tapEvntStrt: function(rct, btn, i) {
          // 対象の原色を取得
          var clrBs = i < 2 ? "r" : i < 4 ? "g" : i < 6 ? "b" : "null";
          // 上のボタンは加算 下のボタンは減算
          this.ex.rgbPrm[clrBs] = numRng(0, this.ex.rgbPrm[clrBs] + (i % 2 ? -1 : 1), 255);

          // 適応
          ilstApp.$SP.cnvsOpt.fillStyle = this.ex.rgb;
        }

       ,lyr: $SP.lyrRMnu
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
         tapEvntStrt: function(rct, btn, i) {
          var $SP = ilstApp.$SP;
          var clr = $SP.cnvsOpt.clrLst[i];
          if (this.ex.evntLst.length - 1 > i) {
            // カラー ボタン
            $SP.cnvsOpt.fillStyle = clr;
            $SP.sm.currentState.itms[2].ex.rgbPrm = {
              r: parseInt(clr.substring(1,3), 16),
              g: parseInt(clr.substring(3,5), 16),
              b: parseInt(clr.substring(5,7), 16)
            };
            $SP.sm.currentState.itms[2].needRender = true;
          } else {
            // push ボタン
            var clr = $SP.sm.currentState.itms[2].ex.rgb;
            // まだカラーがなければ追加
            if ($SP.cnvsOpt.clrLst.indexOf(clr) == -1){
              $SP.sm.currentState.itms[2].ex.rgbPrm = {
                r: parseInt(clr.substring(1,3), 16),
                g: parseInt(clr.substring(3,5), 16),
                b: parseInt(clr.substring(5,7), 16)
              };

              // リスト数を超える場合折り返して追加
              if ($SP.cnvsOpt.clrLst.length + 1 >= this.ex.lstLen) {
                $SP.cnvsOpt.clrLst[this.ex.wrpNum] = clr;
                // ラップ数を更新
                this.ex.wrpNum = this.ex.wrpNum + 1 % this.ex.lstLen;
              } else {
                // 追加
                $SP.cnvsOpt.clrLst.push(clr);
              }
            }
          }
        }

        ,lyr: $SP.lyrRMnu
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
        ,tapEvntStrt: function(evntRct, btn, i) {
          // 新規
          if (btn.name == "新規") {
            var cnvsOpt = $SP.cnvsOpt;

            // 既に作成されてある場合は終了
            if (cnvsOpt.lyr != null) return;

            // キャンバス セットアップ サイズ
            ilstApp.cnvsUtl.setUpCnvs($SP.lyrMain);

            var clientRect = $SP.lyrMain.tgtEle.getBoundingClientRect();
            $SP.lyrMain.cnvs.width  = cnvsOpt.cnvsW;
            $SP.lyrMain.cnvs.height = cnvsOpt.cnvsH;
            $SP.lyrMain.cnvs.style.top = clientRect.y;

            $SP.cnvsOpt.tmp_cnvs.width = cnvsOpt.cnvsW;
            $SP.cnvsOpt.tmp_cnvs.height = cnvsOpt.cnvsH;

            // キャンバスを作成
            ilstApp.$SP.sm.currentState.itms.push(new ilstApp.itemCnvs({
               w: $SP.lyrMain.cnvs.width
              ,h: $SP.lyrMain.cnvs.height
              ,cntxt: $SP.lyrMain.cntxt
              ,ex: {
                 lyr: $SP.lyrMain
               }
            }));
            return;
          }

          if (btn.name == "保存") {
            var cnvsOpt = $SP.cnvsOpt;
            // キャンバスを作成していない場合は保存できないので終了
            if (cnvsOpt.lyr == null) return;

            // 背景色がないとイメージが黒になるため
            // 背景色を設定したキャンバスにコピーして保存
            var cnvs = cnvsOpt.cnvs;
            var cpy_cnvs = document.createElement("canvas");
            var cpy_cntxt = cpy_cnvs.getContext("2d");
            cpy_cnvs.width  = cnvsOpt.cnvsW;
            cpy_cnvs.height = cnvsOpt.cnvsH;
            cpy_cntxt.fillStyle = "#ffffff";
            cpy_cntxt.fillRect(0, 0, cnvsOpt.cnvsW, cnvsOpt.cnvsH);
            cpy_cntxt.drawImage(cnvs, 0, 0);

            // リンクを作成して コピーキャンバのデータURLをセット
            var link = document.createElement("a");
            link.href = cpy_cnvs.toDataURL("image/png");
            link.download = "ilst360.png";
            link.click();
            return;
          }

          if (btn.name == "⤻360°") {
            var itms = $SP.sm.currentState.itms;
            // 他のボタンのイベントを無効
            for (var i = 0; i < itms.length; i++) {
              itms[i].accptEvnt = false;
            }

            // 360°に対応できていないのでダイヤログで知らせる
            var mainEle = document.querySelector("main");
            var clientRect = mainEle.getBoundingClientRect();
            ilstApp.$SP.sm.currentState.itms.push(new ilstApp.itemDialog({
              x: clientRect.width  * 0.525
             ,y: clientRect.height * 0.1
             ,w: clientRect.width  * 0.3
             ,h: clientRect.height * 0.9
             ,cntxt: $SP.lyrs[my.lyr.dlg].cntxt

             ,ex: {
               // イベント
                tapEvntStrt: function(stat) {
                 if(this.ex.pgNow == this.ex.pg.length - 1) {
                   // 最後のページ

                   // ダイヤログを消去
                   itms.pop();

                   // イベントを有効に
                   for (var i = 0; i < itms.length; i++) {
                     itms[i].accptEvnt = true;
                   }

                   // ダイヤログ クリア
                   ilstApp.utl.clrCntxt(my.lyr.bg);
                   ilstApp.utl.clrCntxt(my.lyr.dlg);
                 } else {
                   // ページを更新
                   this.ex.pgNow ++;
                 }
               }

                // レイヤー
              ,lyr: {
                  cnvs: {width: clientRect.width ,height: clientRect.height}
                 ,tgtEle: mainEle
                }

                // ページ内容
              ,pg: [{ttl: "利用できません。", txt: "このバージョンは360°変換に対応していません。", img: null}]
             }
            }));
          }
        }
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

        ,tapEvntStrt: function(evntRct, btn, i) {
          var nm = btn.name;
          var cnvsOpt = $SP.cnvsOpt;
          var lyr = cnvsOpt.lyr;
          var clientRect;
          if (lyr != null)  clientRect = lyr.tgtEle.getBoundingClientRect();

          if (nm == "クリア") {
            var cnvs = $SP.cnvsOpt.cnvs;
            var cntxt = $SP.cnvsOpt.cntxt;
            cntxt.clearRect(0, 0, cnvs.width, cnvs.height);
            return;
          }

          // スクロール アップ/ダウン
          if (nm == "↑" || nm == "↓") {
            if (lyr == null) return;

            var yUp = nm == "↓" ? 10 : nm == "↑" ? -10 : 0;
            cnvsOpt.cnvsScrY = numRng(- cnvsOpt.cnvsH, cnvsOpt.cnvsScrY + yUp, clientRect.height);
            $SP.sm.currentState.itms[6].resizeEvnt();
            return;
          }

          // スクロール レフト/ライト
          if (nm == "←" || nm == "→") {
            if (lyr == null) return;

            var xUp = nm == "→" ? 10 : nm == "←" ? -10 : 0;
            cnvsOpt.cnvsScrX = numRng(- cnvsOpt.cnvsW, cnvsOpt.cnvsScrX + xUp, clientRect.width);
            $SP.sm.currentState.itms[6].resizeEvnt();
            return;
          }
        }

       ,lyr: $SP.lyrFooter
      }
    }));
  }

  resizeEvnt() {

  }
}
