const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const {
  User,
  Product,
  Category,
  Retailer,
  Manufacturer,
  Categtree,
  Order,
  Address,
} = require("../models");
const {
  getProductsByCategory,
  getProductsByTitle,
  getProductsByQuery,
} = require("../utils/products.js");
const catchAsync = require("../utils/catchAsync");
const { requireToken } = require("../middleware.js");
// const { findByIdAndUpdate } = require("../models/Order");
// const Order = require("../models/Order");

const capitalize = ([first, ...rest]) =>
  first.toUpperCase() + rest.join("").toLowerCase();

router.get("/getAllProducts", async (req, res) => {
  const prods = await Product.find({});
  res.send({ prods });
});

router.get("/getSomeProducts", async (req, res) => {
  try {
    const { byCategory } = req.query;
    if (byCategory) {
      const products = await getProductsByCategory(
        req.query.category,
        Number.MAX_SAFE_INTEGER
      );
      res.send({ products });
    } else {
      const products = await getProductsByTitle(
        req.query.title,
        Number.MAX_SAFE_INTEGER
      );
      res.send({ products });
    }
  } catch (err) {
    res.status(500).json("error occurred");
  }
});

router
  .route("/new")
  .get(async (req, res) => {
    try {
      const categories = await Category.find({});
      const retailers = await Retailer.find({});
      const manufacturer = await Manufacturer.find({});
      res.send({ categories, retailers, manufacturer });
    } catch (e) {
      res.status(501).send(e);
    }
  })
  .post(async (req, res) => {
    try {
      const {
        productName,
        description,
        ingredient,
        sku,
        manufacturerID,
        retailerID,
        categoryID,
      } = req.body;
      const category = await Category.findById(categoryID);
      const retailer = await Retailer.findById(retailerID);
      const manufacturer = await Manufacturer.findById(manufacturerID);
      const newProduct = new Product({
        productName,
        manufacturer,
        description,
        ingredient,
        sku,
        retailer,
        category,
      });
      await newProduct.save();
      res.send({ newProduct });
    } catch (e) {
      res.status(500).send(e);
    }
  });

router.post("/addCategory", async (req, res) => {
  let {
    category1,
    category2,
    category3,
    category4,
    category5,
    imageURI,
    imgArr,
  } = req.body;
  category1 = capitalize(category1);
  category2 = capitalize(category2);
  category3 = capitalize(category3);
  category4 = capitalize(category4);
  category5 = capitalize(category5);
  const categoryTop = new Category({
    category1,
    category2,
    category3,
    category4,
    category5,
    imageURI,
  });
  await categoryTop.save();

  // function for category creation and checking
  const findOneCat = async (name, order) => {
    const category = await Categtree.findOne({
      category_name: name,
      order: order,
    });
    return category;
  };

  const newCat = async (name, order, img) => {
    const ctgry = new Categtree({
      category_name: name,
      order: order,
      image: img,
    });
    const category = await ctgry.save();
    return category;
  };
  // new categtree addition schema -----
  const NameArr = [category1, category2, category3, category4, category5];
  try {
    if (req.body) {
      const exists1 = await findOneCat(category1, 1);
      const exists2 = await findOneCat(category2, 2);
      const exists3 = await findOneCat(category3, 3);
      const exists4 = await findOneCat(category4, 4);
      const exists5 = await findOneCat(category5, 5);

      const catArrCheck = [exists1, exists2, exists3, exists4, exists5];
      const newCatArr = [];
      for (let i = 0; i < 5; i++) {
        if (catArrCheck[i] === null) {
          let val = await newCat(NameArr[i], i + 1, imgArr[i]);
          newCatArr[i] = val;
        } else {
          newCatArr[i] = await catArrCheck[i];
        }
      }

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
      // res.status(200).json({ cat: newCatArr });
    }
  } catch (err) {
    res.status(422).json("error occured");
  }

  res.send({ categoryTop });
});

router
  .route("/:id")
  .get(
    requireToken,
    catchAsync(async (req, res) => {
      const product = await Product.findById(req.params.id)
        .populate({ path: "category" })
        .populate({ path: "retailer" })
        .populate({ path: "reviews" });
      const user = await User.findById(req.user._id).populate({
        path: "recentlyViewed",
      });
      let flag = 0;
      if (product !== null) {
        for (let i = 0; i < user.recentlyViewed.length; i++) {
          if (String(user.recentlyViewed[i]._id) == String(product._id)) {
            user.recentlyViewed.splice(i, 1);
            user.recentlyViewed.unshift(product);
            flag = 1;
          }
        }
      }
      if (flag == 0) {
        user.recentlyViewed.unshift(product);
      }
      while (user.recentlyViewed.length > 15) {
        user.recentlyViewed.pop();
      }
      await user.save();
      res.send({ user, product });
    })
  )
  .put(async (req, res) => {
    const { productName, manufacturer, description, ingredient, sku } =
      req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { productName, manufacturer, description, ingredient, sku },
      { new: true }
    );
    await updatedProduct.save();
    res.send({ updatedProduct });
  })
  .delete(async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.send("Deleted!");
    } catch (e) {
      res.send(e);
    }
  });

module.exports = router;
