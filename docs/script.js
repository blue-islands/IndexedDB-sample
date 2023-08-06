var PageState = {
  db: null,

  init: function () {
    var request = indexedDB.open("myDatabase", 1);

    request.onupgradeneeded = function (event) {
      PageState.db = event.target.result;
      var objectStore = PageState.db.createObjectStore("pageState", {
        keyPath: "url",
      });
    };

    request.onsuccess = function (event) {
      PageState.db = event.target.result;
    };
  },

  saveState: function () {
    var data = document.getElementById("dataInput").value;
    var transaction = PageState.db.transaction(["pageState"], "readwrite");
    var objectStore = transaction.objectStore("pageState");
    objectStore.put({ url: window.location.href, data: data });
  },

  loadState: function () {
    var transaction = PageState.db.transaction(["pageState"]);
    var objectStore = transaction.objectStore("pageState");
    var request = objectStore.get(window.location.href);
    request.onsuccess = function (event) {
      document.getElementById("output").innerText = request.result
        ? request.result.data
        : "No data found";
    };
  },
};

// 初期化
PageState.init();
