const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();

const { User, Services , Carousel } = require("../models");
const Service = require('../models/Services');

router.route("/services")
    .get(async (req, res) => {
        const services = await Services.find({});
        res.send({ services });
    })
    .put(async (req, res) => {
        try {
            const { videoConsult, exclusiveProduct, liveYoga, whatsapp, skinCare } = req.body;
            const service = await Services.findById(req.body.id);
            console.log(service);
            if (!service) {
                const newService = new Services({ videoConsult, exclusiveProduct, liveYoga, whatsapp, skinCare })
                await newService.save();
                res.status(200).json({ newService })
            } else {
                const updatedService = await Services.findByIdAndUpdate(req.body.id,
                    { videoConsult, exclusiveProduct, liveYoga, whatsapp, skinCare },
                    { new: true })
                await updatedService.save();
                res.status(200).json({ updatedService })
            }
        } catch (err) {
            res.status(500).send({ err });
            console.log("post Unsuccessful")
        }
    })

router.route('/carousels')
    .get(async (req, res) => {
        const carousel = await Carousel.find({});
        res.send({ carousel })
    })
    .put(async (req, res) => {
        try {
            let { imageURIs } = req.body;
            const carousel = await Carousel.findById(req.body.id);
            if (!carousel) {
                const newCarousel = new Carousel(imageURIs);
                await newCarousel.save()
                res.send({ newCarousel })
            } else {
                const updatedCarousel = await Carousel.findByIdAndUpdate(req.body.id,
                    { imageURIs },
                    { new: true });
                await updatedCarousel.save()
                res.send({ updatedCarousel })
            }
        } catch (e) {
            res.status(501).send({ e })
        }
    })
module.exports = router;
