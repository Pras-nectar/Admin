const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Categtree } = require("../models");

router.post("/new", async (req, res) => {
  console.log(req.body);
  try {
    const category = new Categtree({
      category_name: req.body.name,
      order: req.body.order,
    });
    category.children.push(req.body._id);
    const status = await category.save();
    res.send(status);
  } catch (err) {
    console.log(err);
  }
});

const findOneCat = async (name, order) => {
  const category = await Categtree.findOne({
    category_name: name,
    order: order,
  });
  return category;
};

const newCat = async (name, order) => {
  const ctgry = new Categtree({ category_name: name, order: order });
  const category = await ctgry.save();
  return category;
};

router.post("/addAllFive", async (req, res) => {
  const { category1, category2, category3, category4, category5 } = {
    ...req.body,
  };
  const NameArr = [category1, category2, category3, category4, category5];
  try {
    if (req.body) {
      const exists1 = await findOneCat(category1, 1);
      const exists2 = await findOneCat(category2, 2);
      const exists3 = await findOneCat(category3, 3);
      const exists4 = await findOneCat(category4, 4);
      const exists5 = await findOneCat(category5, 5);

      const catArrCheck = [exists1, exists2, exists3, exists4, exists5];
      console.log(catArrCheck);
      const newCatArr = [];
      for (let i = 0; i < 5; i++) {
        if (catArrCheck[i] === null) {
          let val = await newCat(NameArr[i], i + 1);
          newCatArr[i] = val;
        } else {
          newCatArr[i] = await catArrCheck[i];
        }
      }
      console.log(newCatArr);

      for (let i = 0; i < 5; i++) {
        if (i < 4) {
          if (newCatArr[i].children > 0) {
            for (child of newCatArr[i].children)
              if (newCatArr[i + 1]._id === child._id) {
                break;
              } else {
                newCatArr[i].children.push(newCatArr[i + 1]._id);
              }
          } else {
            newCatArr[i].children.push(newCatArr[i + 1]._id);
          }
        }
      }

      for (let i = 0; i < 5; i++) {
        newCatArr[i].save();
      }
      res.status(200).json({ cat: newCatArr });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/getAllTopCategory", async (req, res) => {
  try {
    const categories = await Category.find({ order: 1 });
    res.status(200).json(categories);
  } catch (err) {
    res.send(err);
  }
});

router.get("/getLowerCategoryOf/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const category = await Categtree.findById(req.params.id);
    console.log(category);
    const catArr = [];
    for (let i = 0; i < category.children.length; i++) {
      const id = category.children[i]._id;
      console.log(id);
      const data = await Category.findById(id);
      catArr.push(data);
    }
    res.status(200).json({ categorys: catArr });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
