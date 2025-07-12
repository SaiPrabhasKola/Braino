import mongoose, { model, Model, mongo, Schema } from "mongoose";
import { string } from "zod";

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
})

export const UserModel = model("users", UserSchema);

enum contentype {
    document,
}


const ContentSchema = new Schema({
    title: { type: String, required: true },
    link: String,
    type: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
})

const LinkSchema = new Schema({
    hash: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'users', required: true, unique: true }
})

export const LinkModel = model("Links", LinkSchema)

export const ContentModel = model("content", ContentSchema);
