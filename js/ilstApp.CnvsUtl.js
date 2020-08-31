/**
 * メインキャンバスの描画や設定に関する関数です
 */

ilstApp.cnvsUtl = {
  // キャンバスをセットアップします
   setUpCnvs: function(lyr) {
     var $SP = ilstApp.$SP;
     var cnvsOpt = $SP.cnvsOpt;

     cnvsOpt.lyr = lyr;
     cnvsOpt.cnvs = lyr.cnvs;
     cnvsOpt.cntxt = lyr.cntxt;

     var tmp_lyr = ilstApp.lyr.mkLyr("tmp_cnvs", lyr.tgtEle);
     cnvsOpt.tmp_cnvs = tmp_lyr.cnvs;
     cnvsOpt.tmp_cntxt = tmp_lyr.cntxt;
     $SP.lyrs.push(tmp_lyr);

     var cnvs = cnvsOpt.cnvs;

     cnvs.style.backgroundColor = "#ffffff";
     cnvs.lineWidth   = cnvsOpt.lineWidth;
     cnvs.strokeStyle = cnvsOpt.strokeStyle;
     cnvs.lineJoin    = cnvsOpt.lineJoin;
     cnvs.lineCap     = cnvsOpt.lineCap;
   }

   // メインキャンバスを自動レイアウトします
   ,cnvsLayout: function(lyr) {
     var $SP = ilstApp.$SP;
     var cnvsOpt = $SP.cnvsOpt;
     var cnvs = cnvsOpt.cnvs;
     var tmp_cnvs = cnvsOpt.tmp_cnvs;

     // 親要素の位置情報
     var clientRect = lyr.tgtEle.getBoundingClientRect();

     // 中央寄せ
     cnvsOpt.cnvsX = clientRect.x + Math.max(0, (clientRect.width - cnvs.width) / 2);
     cnvsOpt.cnvsY = clientRect.y;

     var style = cnvs.style;
     var tmp_style = tmp_cnvs.style;

     style.left =     cnvsOpt.cnvsX + cnvsOpt.cnvsScrX + "px";
     tmp_style.left = cnvsOpt.cnvsX + cnvsOpt.cnvsScrX + "px";

     style.top =      cnvsOpt.cnvsY + cnvsOpt.cnvsScrY + "px";
     tmp_style.top =  cnvsOpt.cnvsY + cnvsOpt.cnvsScrY + "px";
   }

  // メインキャンバスに対するイベントの座標を調整します
  ,clcMousePosition: function(evt) {
    var $SP = ilstApp.$SP;
    var opt = $SP.cnvsOpt;

    var clientRect = opt.lyr.tgtEle.getBoundingClientRect();
    // レイアウト分減算
    return {
      x: evt.x - clientRect.left - Math.max(0, (clientRect.width - $SP.cnvsOpt.cnvsW) / 2 + Math.min(0, $SP.cnvsOpt.cnvsX + $SP.cnvsOpt.cnvsScrX - clientRect.x)),
      y: evt.y - clientRect.top -  Math.max(0, (clientRect.height - $SP.cnvsOpt.cnvsH) / 2)
    };
  }

}
