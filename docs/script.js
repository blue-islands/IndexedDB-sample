const PageState = {
  db: null,
  init() {
    const request = indexedDB.open("myDatabase", 1);
    request.onupgradeneeded = (event) => {
      this.db = event.target.result;
      const objectStore = this.db.createObjectStore("pageState", {
        keyPath: "url",
      });
    };
    request.onsuccess = (event) => {
      this.db = event.target.result;
    };
  },
  saveState(data) {
    const transaction = this.db.transaction(["pageState"], "readwrite");
    const objectStore = transaction.objectStore("pageState");
    const now = new Date().getTime(); // 現在の日時を取得
    objectStore.put({ url: window.location.href, data, timestamp: now });
  },
  loadState() {
   const transaction = this.db.transaction(["pageState"]);
   const objectStore = transaction.objectStore("pageState");
   const request = objectStore.get(window.location.href);
   return new Promise((resolve, reject) => {
     request.onsuccess = (event) => {
       const now = new Date().getTime();
       const oneDay = 24 * 60 * 60 * 1000; // 24時間をミリ秒で表現
       if (request.result && now - request.result.timestamp <= oneDay) {
         resolve(request.result.data);
       } else {
         this.deleteState(); // 期間を超えているデータを削除
         resolve(null);
       }
     };
     request.onerror = (event) => {
       reject(new Error("Data retrieval failed"));
     };
   });
  },
  deleteState() {
    const transaction = this.db.transaction(["pageState"], "readwrite");
    const objectStore = transaction.objectStore("pageState");
    const request = objectStore.delete(window.location.href);
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(true);
      };
      request.onerror = (event) => {
        reject(new Error("Data deletion failed"));
      };
    });
  },
};

// 初期化
PageState.init();
