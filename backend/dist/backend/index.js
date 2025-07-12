"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const JWT_SECRET = "S3CRET";
mongoose_1.default.connect("mongodb+srv://kolasaiprabhas:rOcAwZjlczi4neQe@cluster0.xt5d1.mongodb.net/second-brain");
app.use(express_1.default.json());
app.post('/api/v1/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
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
app.post('/api/v1/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db_1.UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
            });
        }
        const verifiedPass = await bcrypt_1.default.compare(password, user.password);
        if (!verifiedPass) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, JWT_SECRET);
        return res.json({
            message: `Hello ${username}`,
            token: token,
        });
    }
    catch (error) {
        console.error("Error during signin:", error);
        return res.status(500).json({
            message: "An internal server error occurred",
        });
    }
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
    const content = await db_1.ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
});
app.delete("/api/v1/content", middleware_1.Middle, async (req, res) => {
    //@ts-ignore
    const contentId = req.body.contentId;
    await db_1.ContentModel.deleteMany({
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
        const existingLink = await db_1.LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        await db_1.LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        });
        res.json({
            message: "/share/" + hash,
        });
    }
    else {
        await db_1.LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });
        res.json({
            message: "removed link"
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
            message: "sorry the share doesn't exist"
        });
        return;
    }
    const content = await db_1.ContentModel.find({
        userId: link === null || link === void 0 ? void 0 : link.userId
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
