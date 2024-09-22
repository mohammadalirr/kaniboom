import express from "express";

const viewRouter = express.Router();

viewRouter.get("/", (req, res) => {
  res.render("_index");
});
viewRouter.get("/about", (req, res) => {
  res.render("_about");
});
viewRouter.get("/register", (req, res) => {
  res.render("_register");
});
viewRouter.get("/kanicamp", (req, res) => {
  res.render("_kanicamp");
});
viewRouter.get("/kaniamoz", (req, res) => {
  res.render("_kaniamoz");
});
viewRouter.get("/boomcamp", (req, res) => {
  res.render("_boomcamp");
});
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
viewRouter.get("/events", (req, res) => {
  res.render("_events");
});
viewRouter.get("/events/sadaf", (req, res) => {
  res.render("_sadaf");
});



export default viewRouter;
