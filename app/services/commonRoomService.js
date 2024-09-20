const commonRoomConfig = require("../config/commonRoomConfig");
// Required for node-fetch to work in a Docker container
// node-fetch are ESModules and do not support the require() syntax
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

class CommonRoomService {
  constructor() {
    this.apiToken = commonRoomConfig.apiToken;
    this.apiBaseUrl = commonRoomConfig.apiBaseUrl;
    this.destinationSourceId = commonRoomConfig.destinationSourceId;
  }

  async request(endpoint, method = "GET", body = null) {
    const headers = {
      Authorization: `Bearer ${this.apiToken}`,
      "Content-Type": "application/json",
    };

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.apiBaseUrl}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
  }

  async addOrEditUser(userData) {
    return this.request(
      `/source/${this.destinationSourceId}/user`,
      "POST",
      userData
    );
  }

  async addActivity(activityData) {
    return this.request(
      `/source/${this.destinationSourceId}/activity`,
      "POST",
      activityData
    );
  }
}

module.exports = CommonRoomService;
