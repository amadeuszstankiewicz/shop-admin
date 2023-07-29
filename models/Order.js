const { model, models, Schema } = require("mongoose");

const OrderSchema = new Schema({
    orderProducts: Object,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "paid", "completed", "failed", "refunded"],
        required: true
    },
}, {
    timestamps: true
})

export const Order = models.Order || model('Order', OrderSchema);