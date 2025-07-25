const mongoose = require("mongoose");

const homePageSchema = new mongoose.Schema({
  trendingPoems: [
    {
      title: String,
      subtitle: String,
      image: String,
    },
  ],
  featuredQuotes: [
    {
      text: String,
      author: String,
      image: String,
    },
  ],
  contests: [
    {
      title: String,
      description: String,
      image: String,
      buttonText: String,
    },
  ],
});

module.exports = mongoose.model("HomePage", homePageSchema);
