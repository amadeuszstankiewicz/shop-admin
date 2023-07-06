import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import mongoose from "mongoose";

export default async function handler(req, res) {
    const { method } = req;

    await mongooseConnect();

    if(method === "GET") {
        let products;
        if(req.query?.id) {
            products = await Product.findOne({_id: req.query.id})
        } else {
            products = await Product.find()
        }
        res.json(products)
    }

    if(method === "PUT") {
        const { id, title, description, price } = req.body;
        
        await Product.updateOne({_id: id}, {
            title,
            description,
            price
        })
        res.json({status: "success"})
    }

    if(method === "POST") {
        const { title, description, price } = req.body;
        const newProduct = await Product.create({
            title,
            description,
            price
        })

        newProduct.save()
        res.json(newProduct)
    }

    if(method === "DELETE") {
        if(req.query?.id) {
            await Product.deleteOne({_id: req.query.id})
            res.json({status: "success"})
        } else {
            res.json({status: "fail"})
        }
    }
}
  