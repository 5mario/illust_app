/*
アプリを初期化。
シーン遷移を管理する stateMachine をインスタンスし egine に登録して実行します。
*/


// 読み込み後に処理を開始
window.onload = function() {
  // 初期化
  ilstApp.init({
    wrpId: "cnvsArea"
    ,lyrNo: my.lyr.sz
  });

  ilstApp.lyr.init();       //  レイヤーの初期化
  ilstApp.tm.init();        //  タイマー初期化
  var stt = new ilstApp.StateLst();   // State リストの作成

  // state の追加
  // githubで画像の読み取りエラーが発生するため著作権画面は登録しない
  // stt.add(new ilstApp.StateAuthor());   //  著作権画面
  stt.add(new ilstApp.StateTitle());    //  タイトル画面
  stt.add(new ilstApp.StateMain());     //  メイン画面

  // リストを登録
  var stateMachine = new ilstApp.StateMachine({
         states:  stt.getLst()
        ,currentStateNm: stt.getFrstNm()
      });

  // エンジンの登録
  // アプリを実行します
  var engine = new ilstApp.Engine(stateMachine);
}
