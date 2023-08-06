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
    objectStore.put({ url: window.location.href, data });
  },
  loadState() {
    const transaction = this.db.transaction(["pageState"]);
    const objectStore = transaction.objectStore("pageState");
    const request = objectStore.get(window.location.href);
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(request.result ? request.result.data : null);
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
