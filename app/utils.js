function getActivityType(item) {
  if (item.type === "job") {
    return "other";
  } else if (item.type === "story") {
    return "made_post_topic";
  } else if (item.type === "comment") {
    return "commented_replied";
  } else {
    return "other";
  }
}

function convertItemToActivity(item, user) {
  return {
    id: item.id.toString(),
    activityType: getActivityType(item),
    user: {
      id: user.id,
      fullName: user.id,
      bio: user.about ? user.about : "",
    },
    activityTitle: {
      type: "text",
      value: item.title ? item.title : "",
    },
    content: {
      type: "markdown",
      value: item.text ? item.text : "",
    },
    timestamp: new Date(item.time * 1000).toUTCString(),
    url: `https://news.ycombinator.com/item?id=${item.id}`,
  };
}

module.exports = { convertItemToActivity };
