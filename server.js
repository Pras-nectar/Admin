require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");


const app = express();

const { userRoutes,productRoutes, postRoutes, retailerRoutes, authRoutes, approvalRoutes, stylingRoutes, offerRoutes, wishlistRoutes,categtreeRoutes, manufacturerRoutes, orderRoutes } = require("./Routes");

require("./connection");

app.use(express.json());
// app.use(cors)
const port = process.env.PORT || 3001;

//backend routes
app.get("/", (req, res) => {
    res.send(`Hello from team Nectars`);
});

app.use('/api/admin/auth/', authRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/admin/post', postRoutes);
app.use('/api/admin/retailer', retailerRoutes);
app.use('/api/admin/user', userRoutes);
app.use('/api/admin/approval', approvalRoutes);
app.use('/api/admin/styling', stylingRoutes);
app.use('/api/admin/offer', offerRoutes);
app.use('/api/admin/wishlist',wishlistRoutes);
app.use('/api/admin/manufacturer',manufacturerRoutes);
app.use('/api/admin/category',categtreeRoutes);
app.use('/api/admin/order',orderRoutes);


//port declaration

app.listen(port, () => {
    console.log(`server is running`);
});

