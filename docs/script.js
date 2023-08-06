var db;

// データベースを開く
var request = indexedDB.open("myDatabase", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  // keyPathを'url'に変更
  var objectStore = db.createObjectStore("pageState", { keyPath: "url" });
};

request.onsuccess = function (event) {
  db = event.target.result;
};

// データを保存
function saveState() {
  var data = document.getElementById("dataInput").value;
  var transaction = db.transaction(["pageState"], "readwrite");
  var objectStore = transaction.objectStore("pageState");
  // idの代わりにurlをキーとして使用
  objectStore.put({ url: window.location.href, data: data });
}

// データを取得
function loadState() {
  var transaction = db.transaction(["pageState"]);
  var objectStore = transaction.objectStore("pageState");
  // 現在のページのURLをキーとしてデータを取得
  var request = objectStore.get(window.location.href);
  request.onsuccess = function (event) {
    document.getElementById("output").innerText = request.result
      ? request.result.data
      : "No data found";
  };
}
