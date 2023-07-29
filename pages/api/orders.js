import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        // Signed in
        if(session.user?.email !== process.env.ADMIN_EMAIL) {
            res.setHeader('Set-Cookie', [
                `next-auth.session-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
                `next-auth.csrf-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
            ]);
            res.status(403).json({ error: 'You are not authorized' });
        }
    } else {
        // Not Signed in
        res.status(403).json({ error: 'You are not authenticated' });
    }

    const { method } = req;
    await mongooseConnect();

    if(method === "GET") {
        let orders;
        //if(req.query?.id) {
        //    products = await Product.findOne({_id: req.query.id}).populate('category')
        //} else {
            orders = await Order.find().sort({createdAt:-1})
        //}
        res.json(orders)
    }

    /*
    if(method === "PUT") {
        const { id, title, description, price, category, images } = req.body;

        let finalCategory = null
        if(category !== '') {
            finalCategory = category;
        }
        await Product.updateOne({_id: id}, {
            title,
            description,
            price,
            category: finalCategory,
            images
        })
        res.json({status: "success"})
    }

    if(method === "POST") {
        const { title, description, price, category, images } = req.body;
        const newProduct = await Product.create({
            title,
            description,
            price,
            category,
            images
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
    */
}
  