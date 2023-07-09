import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
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
  