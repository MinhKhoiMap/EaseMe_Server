const { Router } = require("express");
const { StatusCodes } = require("http-status-codes");
const TagModelClass = require("../DAL/models/tagModel");

const tagRoute = Router();
const TagModel = new TagModelClass();

tagRoute.get("/all", (req, res) => {
  TagModel.getAllTags().then((response) => {
    res.status(StatusCodes.OK).json({ tags: response });
  });
});

module.exports = tagRoute;
