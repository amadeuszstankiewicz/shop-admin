import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        // User is not logged in
        res.status(401).json({ error: 'You are not authenticated' });
        return;
    }

    if (session.user?.email !== process.env.ADMIN_EMAIL) {
        // User is logged in, but not with the specific admin email
        res.setHeader('Set-Cookie', [
            `next-auth.session-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
            `next-auth.csrf-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        ]);
        res.status(403).json({ error: 'You are not authorized' });
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
  