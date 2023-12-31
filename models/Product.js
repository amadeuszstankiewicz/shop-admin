const { model, models, Schema } = require("mongoose");

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    images: {
        type: [String]
    }
});

export const Product = models.Product || model('Product', ProductSchema);