"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const JWT_SECRET = "S3CRET";
mongoose_1.default.connect("mongodb+srv://kolasaiprabhas:rOcAwZjlczi4neQe@cluster0.xt5d1.mongodb.net/second-brain");
app.use(express_1.default.json());
app.post("/api/v1/signup", async (req, res) => {
    try {
        const signupSchema = zod_1.z.object({
            username: zod_1.z.string().min(3, "The min size for username is 3").max(18, "The max size is 18"),
            password: zod_1.z.string().min(6, "The password must be 6 chars long").max(18, "The max size is 18"),
        });
        const validationResult = signupSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(422).json({
                error: validationResult.error.errors.map((err) => err.message).join(", "),
            });
        }
        const { username, password } = validationResult.data;
        const checkUser = await db_1.UserModel.findOne({ username });
        if (checkUser) {
            return res.status(400).json({ message: "user already exists" });
        }
        const hashedPass = await bcrypt_1.default.hash(password, 8);
        await db_1.UserModel.create({
            username,
            password: hashedPass,
        });
        res.status(200).json({
            message: `You're signed up, ${username}!`,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if ("code" in error && error.code === 11000) {
                res.status(400).json({ error: "Username already exists. Please use a different username." });
            }
            else {
                res.status(500).json({ error: `An error occurred: ${error.message}` });
            }
        }
        else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});
app.post("/api/v1/signin", async (req, res) => {
    const { username, password } = req.body;
    const user = await db_1.UserModel.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: "User does not exist",
        });
    }
    const verifiedPass = await bcrypt_1.default.compare(password, user.password);
    if (!verifiedPass) {
        res.status(401).json({
            message: "invalid creds"
        });
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, JWT_SECRET);
    res.status(200).json({
        redirect: "ok",
        Message: `hello ${username}`,
        token: token
    });
});
app.post("/api/v1/content", middleware_1.Middle, async (req, res) => {
    const { title, link, type } = req.body;
    await db_1.ContentModel.create({
        title: title,
        link: link,
        type: type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    });
    res.json({
        message: "content created"
    });
});
app.get("/api/v1/content", middleware_1.Middle, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const { type } = req.query;
    const query = { userId };
    if (type) {
        query.type = type;
    }
    const content = await db_1.ContentModel.find(query).populate("userId", "username");
    res.json({
        content
    });
});
app.delete("/api/v1/content", middleware_1.Middle, async (req, res) => {
    //@ts-ignore
    const contentId = req.body.contentId;
    await db_1.ContentModel.deleteOne({
        contentId,
        //@ts-ignore
        userId: req.userId
    });
    res.json({
        message: "deleted"
    });
});
app.post("/api/v1/brain/share", middleware_1.Middle, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const existhash = await db_1.LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if (existhash) {
            res.json({
                message: "share is on",
                hash: existhash.hash
            });
        }
        else {
            const hash = (0, utils_1.random)(10);
            await db_1.LinkModel.create({
                //@ts-ignore
                userId: req.userId,
                hash: hash
            });
            res.json({
                message: "share is on",
                hash: hash
            });
        }
    }
    else {
        await db_1.LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });
        res.json({
            message: "removed sharelink"
        });
    }
});
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await db_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "incorrect share link"
        });
        return;
    }
    const content = await db_1.ContentModel.find({
        userId: link.userId
    });
    const user = await db_1.UserModel.findOne({
        userId: link.userId
    });
    res.json({
        username: user === null || user === void 0 ? void 0 : user.username,
        content: content
    });
});
app.listen(3000);
