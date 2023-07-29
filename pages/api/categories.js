import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";

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
        let categories;
        if(req.query?.id) {
            categories = await Category.findOne({_id: req.query.id})
        } else {
            categories = await Category.find()
        }
        res.json(categories)
    }

    if(method === "POST") {
        const { name } = req.body;
        const newCategory = await Category.create({
            name
        })

        newCategory.save()
        res.json(newCategory)
    }

    
    if(method === "PUT") {
        const { id, name } = req.body;
        await Category.updateOne({_id: id}, {
            name
        })
        res.json({status: "success"})
    }

    if(method === "DELETE") {
        if(req.query?.id) {
            await Category.deleteOne({_id: req.query.id})
            res.json({status: "success"})
        } else {
            res.json({status: "fail"})
        }
    }
}
  