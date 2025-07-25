const express = require("express");
const router = express.Router();
const HomePage = require("../models/homePage.js");

// REST API to get homepage data (return inside 'data' object, do not delete or overwrite)
router.get("/homepage", async (req, res) => {
  try {
    let data = await HomePage.findOne();
    if (!data) {
      // If no data exists, insert static data once
      data = new HomePage({
        trendingPoems: [
          {
            title: "Whispers of the Wind",
            subtitle: "A poem about nature's beauty.",
            image: "poem1.png",
          },
          {
            title: "Midnight Musings",
            subtitle: "Reflections on a sleepless night.",
            image: "poem2.png",
          },
          {
            title: "Echoes of the Heart",
            subtitle: "A journey through emotions.",
            image: "poem3.png",
          },
        ],
        featuredQuotes: [
          {
            text: "Reflections on a sleepless night.",
            author: "Author 1",
            image: "quote1.png",
          },
          {
            text: "A journey through emotions.",
            author: "Author 2",
            image: "quote2.png",
          },
          {
            text: "A poem about nature's beauty.",
            author: "Author 3",
            image: "quote3.png",
          },
        ],
        contests: [
          {
            title: "Summer Poetry Slam",
            description: "Showcase your best poems.",
            image: "contest1.png",
            buttonText: "Join Now",
          },
          {
            title: "Creative Writing Workshop",
            description: "Learn from experienced writers.",
            image: "contest2.png",
            buttonText: "Join Now",
          },
          {
            title: "Short Story Contest",
            description: "Craft compelling narratives.",
            image: "contest3.png",
            buttonText: "Join Now",
          },
        ],
      });
      await data.save();
    }
    // Return only the grouped data, not the _id or __v
    res.json({
      data: {
        trendingPoems: data.trendingPoems,
        featuredQuotes: data.featuredQuotes,
        contests: data.contests,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching homepage data" });
  }
});

module.exports = router;
