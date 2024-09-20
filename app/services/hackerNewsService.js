const { getDatabase, ref, onValue, get } = require("firebase/database");
const { initializeFirebaseApp } = require("../config/firebaseConfig");

class HackerNewsService {
  constructor() {
    initializeFirebaseApp();
    this.db = getDatabase();
  }

  async getItem(id) {
    try {
      const dbRef = ref(this.db, `/v0/item/${id}`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
      return null;
    }
  }

  async getUser(id) {
    try {
      const dbRef = ref(this.db, `/v0/user/${id}`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
      return null;
    }
  }

  async getStories(storyType) {
    try {
      const dbRef = ref(this.db, `/v0/${storyType}`);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log("No data available");
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
      return null;
    }
  }

  async subscribeForUpdates(callback) {
    const dbRef = ref(this.db, "/v0/updates");

    onValue(
      dbRef,
      async (snapshot) => {
        const data = snapshot.val();
        console.log("Detected update: ", data);
        await callback(data);
      },
      (error) => {
        console.error("Subscription error:", error);
      }
    );
  }
}

module.exports = HackerNewsService;
