/**
 * 基本的な関数をまとめてあります
 */

// 現在の時間を取得
window.getTime = function() {
  return performance.now();
};

// 数値の整数化
window.I = function(i) {
  return i | 0;
};

/**
 * 複数のオブジェクトをマージします
 * @return {object} マージしたオブジェクト
 */
window.cmb = function() {
  var i = 1,
      key,
      length = arguments.length,
      target = arguments[0] || {},   //  引数がなければ空のオブジェクトを返す
      isDeep = false;

  // 第一引数が true だったときはディープコピー
  if (target === true) {
    ++i;
    target = arguments[1] || {};
    isDeep = true;
  }

  for (; i < length; ++i) {
    for (key in arguments[i]) {   //  key - プロパティネーム
      if (arguments[i].hasOwnProperty(key)) {
        // ディープコピーの場合は再帰呼び出し
        if (isDeep && Object.prototype.toString.call(arguments[i][key]) === '[object Object]') {
          target[key] = cmb(target[key], arguments[i][key]);
        } else {
          target[key] = arguments[i][key];
        }
      }
    }
  }

  return target;
};

// 数値が範囲内か確認します
window.isRng = function(rct, pos) {
  if (pos.x < rct.x || rct.x + rct.w <= pos.x
   || pos.y < rct.y || rct.y + rct.h <= pos.y) {
     return false;
   }
   return true;
}

// 数値を範囲に収める
window.numRng = function(min, n, max) {
  if (n < min) {return min;}
  if (n > max) {return max;}
  return n;
}

// コンテキストがレイヤー番号の場合 その番号のレイヤーを返します
window.getLyrCntxt = function(cntxt) {
  var $SP = ilstApp.$SP;
  if (typeof cntxt == "number") cntxt = $SP.lyrs[cntxt].cntxt;
  return cntxt;
}

// RGB を HEX に変換します
window.rgb2hex = function(rgb) {
  return "#" + rgb.map(function(val) {
    return ("0" + val.toString(16)).slice(-2);
  }).join("") ;
}
