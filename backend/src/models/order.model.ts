import { Model, model, Schema, Types } from "mongoose";
import { Food } from "./food.model";
import { OrderStatus } from "../utils/order-status";

export interface LatLng {
  lat: string;
  lng: string;
}

const latLngSchema = new Schema<LatLng>({
  lat: { type: String, required: true },
  lng: { type: String, required: true },
});

export interface OrderItem {
  food: Food;
  price: number;
  quantity: number;
}

export const orderItemSchema = new Schema<OrderItem>({
  food: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

export interface Order {
  id: number;
  items: OrderItem[];
  totalPrice: number;
  name: string;
  address: string;
  addressLatLng: LatLng;
  paymentId: string;
  status: OrderStatus;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<Order>(
  {
    items: { type: [orderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    addressLatLng: { type: latLngSchema, required: true },
    paymentId: { type: String },
    status: { type: String, default: OrderStatus.NEW },
    user: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },

    // id instead of _id
  }
);

export const OrderModel = model("order", orderSchema);
