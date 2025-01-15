import express from "express";
import Page from "../models/contents/Page";
import { inputsData } from "../static/multiSelectData";
import Main from "../models/contents/Main";

const viewRouter = express.Router();

// viewRouter.get("/", (req, res) => {
//   res.render("_index");
// });

viewRouter.get("/alishahi", (req, res) => {
  res.render("_alishahi");
});
viewRouter.get("/ebadi", (req, res) => {
  res.render("_ebadi");
});
// viewRouter.get("/about", (req, res) => {
//   res.render("_about");
// });
viewRouter.get("/register", (req, res) => {
  res.render("_register");
});
// viewRouter.get("/kanicamp", (req, res) => {
//   res.render("_kanicamp");
// });
viewRouter.get("/kaniamoz", (req, res) => {
  res.render("_kaniamoz");
});
// viewRouter.get("/boomcamp", (req, res) => {
//   res.render("_boomcamp");
// });
viewRouter.get("/bootcamp-masir", (req, res) => {
  res.render("_bootcamp-masir");
});
viewRouter.get("/bootcamp-product-management", (req, res) => {
  res.render("_bootcamp-product-management");
});
viewRouter.get("/bootcamp-gaming", (req, res) => {
  res.render("_bootcamp-gaming");
});
viewRouter.get("/bootcamp-management", (req, res) => {
  res.render("_bootcamp-management");
});
viewRouter.get("/bootcamp-mineralprocessing", (req, res) => {
  res.render("_bootcamp-mineralprocessing");
});
// viewRouter.get("/events", (req, res) => {
//   res.render("_events");
// });
viewRouter.get("/events/sadaf", (req, res) => {
  res.render("_sadaf");
});
viewRouter.get("/events/sadaf-yazd-mine", (req, res) => {
  res.render("_sadaf-yazd-mine");
});
// viewRouter.get("/news", (req, res) => {
//   res.render("_news");
// });
viewRouter.get("/news/mine-expo", (req, res) => {
  res.render("_mine-expo");
});
viewRouter.get("/events/mine-expo", (req, res) => {
  res.render("_mine-expo");
});
viewRouter.get("/news/conmine", (req, res) => {
  res.render("_conmine");
});

/**
 * @Dynamic routes
 */
viewRouter.get("/news", (req, res) => {
  Page.find({ type: "news" })
    .then((contents) => {
      console.log(contents); 
      res.render("_news", { contents, BASE_URL: process.env.BASE_URL });
    })
    .catch((err) => {
      console.error("Error fetching news:", err);
      res.status(500).send("Internal Server Error");
    });
});
viewRouter.get("/events", (req, res) => {
  Page.find({ type: "events" })
    .then((contents) => {
      console.log(contents);
      res.render("_events", { contents, BASE_URL: process.env.BASE_URL });
    })
    .catch((err) => {
      console.error("Error fetching news:", err);
      res.status(500).send("Internal Server Error");
    });
});
viewRouter.get("/kanicamp", (req, res) => {
  Page.find({ type: "kanicamps" })
    .then((contents) => {
      console.log(contents); 
      res.render("_kanicamp", { contents, BASE_URL: process.env.BASE_URL });
    })
    .catch((err) => {
      console.error("Error fetching news:", err);
      res.status(500).send("Internal Server Error");
    });});
viewRouter.get("/boomcamp", (req, res) => {
  Page.find({ type: "boomcamps" })
    .then((contents) => {
      console.log(contents);
      res.render("_boomcamp", { contents, BASE_URL: process.env.BASE_URL });
    })
    .catch((err) => {
      console.error("Error fetching news:", err);
      res.status(500).send("Internal Server Error");
    });});

viewRouter.get("/news/:page", async (req, res) => {
  const page = req.params.page;
  try {
    const pageData = await Page.findOne({ name: page });
    res.render("page", {
      pageData,
      inputsData,
      BASE_URL: process.env.BASE_URL,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
viewRouter.get("/events/:page", async (req, res) => {
  const page = req.params.page;
  try {
    const pageData = await Page.findOne({ name: page });
    res.render("page", {
      pageData,
      inputsData,
      BASE_URL: process.env.BASE_URL,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
viewRouter.get("/kanicamp/:page", async (req, res) => {
  const page = req.params.page;
  try {
    const pageData = await Page.findOne({ name: page });
    res.render("page", {
      pageData,
      inputsData,
      BASE_URL: process.env.BASE_URL,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
viewRouter.get("/boomcamp/:page", async (req, res) => {
  const page = req.params.page;
  try {
    const pageData = await Page.findOne({ name: page });
    res.render("page", {
      pageData,
      inputsData,
      BASE_URL: process.env.BASE_URL,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
viewRouter.get("/about", async (req, res) => {
  try {
    const pageData = await Page.findOne({ name: "about" });
    res.render("page", {
      pageData,
      inputsData,
      BASE_URL: process.env.BASE_URL,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

viewRouter.get("/", async (req, res) => {
  try {
    const pageData = await Main.findOne({ type: "main" });
    res.render("main-page", {
      pageData,
      inputsData,
      BASE_URL: process.env.BASE_URL,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


export default viewRouter;
