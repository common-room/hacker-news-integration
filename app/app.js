const appConfig = require("./config/appConfig");
const HackerNewsService = require("./services/hackerNewsService");
const CommonRoomService = require("./services/commonRoomService");
const { convertItemToActivity } = require("./utils");

class App {
  constructor() {
    this.hackerNewsService = new HackerNewsService();
    this.commonRoomService = new CommonRoomService();
    this.config = appConfig;
  }

  async run() {
    // Fetch historical data from Hacker News
    try {
      await this.backfillData();
    } catch (e) {
      console.error("Error fetching historical data:", e);
    }

    // Subscribe for updates
    try {
      await this.subscribeForUpdates();
    } catch (e) {
      console.error("Update subscription failed: ", e);
    }
  }

  // Backfill data from Hacker News for stories and comments that mention 
  // one of the keywords in the config. 
  async backfillData() {
    console.log("Backfilling data...");
    for (const storyType of this.config.storyTypes) {
      const stories = await this.hackerNewsService.getStories(storyType);
      for (const storyId of stories) {
        const item = await this.hackerNewsService.getItem(storyId);

        // Found a story mentioning the keyword! Add to Common Room and walk it's children
        if (this.shouldAddToCommonRoom(item)) {
          console.log(
            `Adding Story [${item.id}] "${item.title}" to Common Room...`
          );
          const user = await this.hackerNewsService.getUser(item.by);
          await this.commonRoomService.addActivity(
            convertItemToActivity(item, user)
          );

          // Find all children that might also mention a keyword and add to Common Room
          try {
            await this.recurseOverKids(item);
          } catch (e) {
            console.error(`Error recursing over ${item}:`, e);
          }
        }
      }
    }
    console.log("Backfill complete!");
  }

  // Subscribe for updates from Hacker News. If a story is detected to contain
  // a keyword, add it to the Common Room and walk it's children.
  async subscribeForUpdates() {
    console.log("Subscribing for updates...");
    await this.hackerNewsService.subscribeForUpdates(async (update) => {
      const items = update && update.items;
      for (const itemId of items) {
        const item = await this.hackerNewsService.getItem(itemId);
        if (this.shouldAddToCommonRoom(item)) {
          const user = await this.hackerNewsService.getUser(item.by);
          await this.commonRoomService.addActivity(
            convertItemToActivity(item, user)
          );

          if (item.type == "story") {
            try {
              await this.recurseOverKids(item);
            } catch (e) {
              console.error(`Error recursing over ${item}:`, e);
            }
          }
        }
      }
    });
  }

  async recurseOverKids(item) {
    if (item && item.kids && item.kids.length > 0) {
      for (const kid of item.kids) {
        if (this.shouldAddToCommonRoom(kid)) {
          console.log(
            `Adding Comment [${kid.id}] "${kid.title}" to Common Room...`
          );
          const user = await this.hackerNewsService.getUser(item.by);
          await this.commonRoomService.addActivity(
            convertItemToActivity(item, user)
          );
        }

        await this.recurseOverKids(kid);
      }
    }
  }

  shouldAddToCommonRoom(item) {
    return (
      item &&
      item.title &&
      this.config.keywords.some((keyword) =>
        item.title.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }
}

const app = new App();
app.run();
