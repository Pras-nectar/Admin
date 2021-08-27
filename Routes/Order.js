const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { User, Address, Order, Product, Cart } = require("../models");
const {
  requireToken,
  isPhoneNoVerified,
  isAuthorized,
  isDocAuthor,
  isAddressAuthor,
} = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");
const { route } = require("./categtree");

// router.route('/new')
//     .get(requireToken, catchAsync(async (req, res) => {
//         const defaultAddress = await Address.findOne({ user: req.user._id, isDefault: true })
//         res.send({ defaultAddress })
//     }))
//     .post(requireToken, catchAsync(async (req, res) => {
//         const {addressID} = req.body;
//         const address = await Address.findOne({_id: addressID, user: req.user._id, isDefault: true })
//         if(!address){
//             return res.send({ error: "Address cannot be empty." });
//         }
//         const { fromCart } = req.body;
//         if (fromCart === true) {
//             const { cartID } = req.body;
//             const cart = await Cart.findById(cartID);
//             if (!cart) {
//                 return res.send({ error: "Cart doesnt exist or is empty." });
//             }
//             let total_base_price=0,total_final_price=0,total_offer=0
//             let items = []
//             for(let i=0;i<cart.items.length;i++){
//                 const product = await Product.findById(cart.items[i].product);
//                 for (let i = 0; i < product.sku.length; i++) {
//                     if (String(product.sku[i]._id) === String(cart.items[i].skuID)) {
//                         base_price = product.sku[i].base_price;
//                         offer = product.sku[i].offer;
//                         final_price = product.sku[i].final_price;
//                     }
//                 }
//                 items.push({
//                     ...cart.items[i]._doc,
//                     base_price,
//                     offer: (offer*base_price)/100,
//                     final_price,
//                     productOrderStatus: "Order Placed"
//                 })
//                 total_base_price+=base_price
//                 total_final_price+=final_price
//                 total_offer+= (offer*base_price)/100
//             }
//             let shippingAddress = {...address}._doc
//             delete shippingAddress.user

//             const transactionDetails = {
//                 total_base_price,
//                 total_offer,
//                 total_final_price
//             }

//             const newOrder = new Order({ user: req.user._id, items,shippingAddress,transactionDetails, orderStatus: "Order Placed" })
//             await newOrder.save()
//             return res.send({newOrder})
//         }
//         else
//             if (fromCart === false) {
//                 const { productID, skuID, quantity } = req.body
//                 if (quantity <= 0) {
//                     return res.status(500).send({ error: "Invalid quantity" })
//                 }
//                 var base_price,final_price,offer;
//                 const product = await Product.findById(productID);
//                 const skuProduct = await Product.findOne({ sku: { $elemMatch: { _id: req.body.skuID } } });
//                 if (!product)
//                     return res.status(500).send({ error: "Invalid product" })
//                 if (!skuProduct)
//                     return res.status(500).send({ error: "Invalid sku" })
//                 if (String(skuProduct._id) !== String(product._id))
//                     return res.status(501).send({ error: "Product and sku doesnt match" })
//                 for (let i = 0; i < skuProduct.sku.length; i++) {
//                     if (String(skuProduct.sku[i]._id) === String(skuID)) {
//                         base_price = skuProduct.sku[i].base_price;
//                         offer = skuProduct.sku[i].offer;
//                         final_price = skuProduct.sku[i].final_price;
//                     }
//                 }
//                 const items = [{
//                     product: productID,
//                     skuID,
//                     quantity,
//                     base_price,
//                     offer: (offer*base_price)/100,
//                     final_price,
//                     productOrderStatus: "Order Placed"
//                 }]

//                 let shippingAddress = {...address}._doc
//                 delete shippingAddress.user

//                 const transactionDetails = {
//                     total_base_price: base_price,
//                     total_offer: (offer*base_price)/100,
//                     total_final_price: final_price,
//                 }

//                 const newOrder = new Order({ user: req.user._id, items,shippingAddress,transactionDetails })
//                 await newOrder.save()
//                 return res.send({newOrder})
//             }
//         return res.send({error: "Invalid choice"})
//     }))

// router.get("/recent", requireToken, catchAsync(async (req, res) => {
//     const recentOrders = await Order.find({ user: req.user._id }).populate({path: "items", populate: {path: "product"}}).sort({createdAt: -1})
//     res.send({ recentOrders })
// }))
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
            $in: ["Order Placed", "Executed", "Dispatched", "Delivered"],
          },
        },
      },
    }); 
    const orderArr = [];
    for (let i = 0; i < orders.length; i++) {
      let user = await User.findById(orders[i].user);
      let items = orders[i].items;
      for (let j = 0; j < items.length; j++) {
        let orderDetails = {
          orderId: orders[i]._id,
          productName: "",
          netQuantity: "",
          finalPrice: "",
          orderStatus: items[j].productOrderStatus,
          quantity: items[j].Quantity,
          transitionDetails: orders[i].transactionDetails,
          address: orders[i].shippingAddress,
          trackId: "",
          username: user.username,
          usermail: user.email,
          skuID:"",
          prodID:""
        };
        const product = await Product.findById(items[j].product);
        orderDetails.productName = product.productName;
        orderDetails.prodID = product._id;

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
    //   const updatedOrder = await Order.findByIdAndUpdate(
    //     req.params.id,
    //     { ...req.body },
    //     { new: true }
    //   );
    console.log(req.body)
    const updatedOrd = await Order.findById(req.params.id)
    const items = updatedOrd.items
    for(let i = 0; i< items.length; i++){
        if(req.body.prodID === String(items[i].product) && req.body.skuID === items[i].skuID){
            if(req.body.newstatus){
                console.log(req.body.newstatus)
                updatedOrd.items[i].productOrderStatus = req.body.newstatus
            }
            break
        }
    }
    console.log(updatedOrd)
    await updatedOrd.save()
    res.send({ updatedOrd });
    })
  );

module.exports = router;
