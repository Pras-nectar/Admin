const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { User, Address, Order, Product, Cart, Retailer } = require("../models");
const {
  requireToken,
  isPhoneNoVerified,
  isAuthorized,
  isDocAuthor,
  isAddressAuthor,
} = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");
const { route } = require("./categtree");

router.post("/add_Orders", async (req, res) => {
    // console.log(req.body)
  const order = new Order({ ...req.body });
  await order.save();
  res.status(200).json(order);
});

router.get(
  "/getIncompleteorders",
  catchAsync(async (req, res) => {
    const orders = await Order.find({
      items: {
        $elemMatch: {
          productOrderStatus: {
            $in: ["Order Placed", "Initiated", "Dispatched", "Delivered"],
          },
        },
      },
    }); 
    const orderArr = [];
    for (let i = 0; i < orders.length; i++) {
      let user = await User.findById(orders[i].user);
      let items = orders[i].items;


      for (let j = 0; j < items.length; j++) {
          if(items[j].productOrderStatus === "Return started" || items[j].productOrderStatus === "Payment Settled")
          {continue}
        let orderDetails = {
          orderId: orders[i]._id,
          productName: "",
          netQuantity: "",
          finalPrice: "",
          orderStatus: items[j].productOrderStatus,
          quantity: items[j].Quantity,
          transitionDetails: orders[i].transactionDetails,
          address: orders[i].shippingAddress,
          trackId: items[j].trackingID,
          seller:"",
          username: user.username,
          usermail: user.email,
          itemID:items[j]._id,
          time:orders[i].createdAt
        };
        const product = await Product.findById(items[j].product);
        orderDetails.productName = product.productName;
        const seller = await Retailer.findById(product.retailer)
        orderDetails.seller = seller.name
        for (let k = 0; k < product.sku.length; k++) {
          if (items[j].skuID === String(product.sku[k]._id))
            orderDetails.netQuantity = product.sku[k].netQuantity;
            orderDetails.finalPrice = product.sku[k].final_price;
            break;
        }
        orderArr.push(orderDetails)
      }
    }
    res.send({ orderArr });
  })
);


router.get(
  "/getIncompleteordersReturn",
  catchAsync(async (req, res) => {
    const orders = await Order.find({
      items: {
        $elemMatch: {
          isReturned: true,
          productReturnStatus: {
            $in: ["Return initiated","Return Taken","Returned"],
          },
        },
      },
    }); 
    const orderArr = [];
    for (let i = 0; i < orders.length; i++) {
      let user = await User.findById(orders[i].user);
      let items = orders[i].items;
      for (let j = 0; j < items.length; j++) {
          if(items[j].productReturnStatus === "Return Payment Settled" || items[j].productOrderStatus !== "Return started")
          {continue}
        let orderDetails = {
          orderId: orders[i]._id,
          productName: "",
          netQuantity: "",
          finalPrice: "",
          orderStatus: items[j].productReturnStatus,
          quantity: items[j].Quantity,
          transitionDetails: orders[i].transactionDetails,
          address: orders[i].shippingAddress,
          trackId: items[j].trackingID,
          seller:"",
          username: user.username,
          usermail: user.email,
          itemID:items[j]._id,
          time:orders[i].createdAt
        };
        const product = await Product.findById(items[j].product);
        orderDetails.productName = product.productName;
        orderDetails.prodID = product._id;
        const seller = await Retailer.findById(product.retailer)
        orderDetails.seller = seller.name

        for (let k = 0; k < product.sku.length; k++) {
          if (items[j].skuID === String(product.sku[k]._id))
            orderDetails.netQuantity = product.sku[k].netQuantity;
            orderDetails.finalPrice = product.sku[k].final_price;
            orderDetails.skuID = product.sku[k]._id
            break;
        }
        orderArr.push(orderDetails)
      }
    }
    res.send({ orderArr });
  })
);

router
  .route("/:id")
  .get(
    requireToken,
    isAuthorized(["SuperAdmin"]),
    catchAsync(async (req, res) => {
      const order = await Order.findById(req.params.id)
        .populate({ path: "user" })
        .populate({ path: "items", populate: { path: "product" } });
      res.send({ order });
    })
  )
  .put(
    catchAsync(async (req, res) => {
    // console.log(req.body)
    const updatedOrd = await Order.findById(req.params.id)
    const items = updatedOrd.items
    for(let i = 0; i< items.length; i++){
        if(String(req.body.itemID) === String(items[i]._id) ){
            console.log(req.body)
            if(req.body.newstatus){
                updatedOrd.items[i].productOrderStatus = req.body.newstatus
            }else
            if(req.body.trackId){
              updatedOrd.items[i].trackingID = req.body.trackId
            }else 
            if(req.body.returnsts){
                updatedOrd.items[i].productReturnStatus = req.body.returnsts
                updatedOrd.items[i].productOrderStatus = "Return started"
            }
            break
        }
    }
    // console.log(updatedOrd)
    await updatedOrd.save()
    res.send({ updatedOrd });
    })
  );

module.exports = router;
