import express, { Request, Response } from "express";
import { z } from "zod";
import jwt, { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel, ContentModel, LinkModel } from "./db";
import { Middle } from "./middleware";
import mongoose from "mongoose";
import { random } from "./utils";
import cors from "cors"
const app = express();
app.use(cors())

const JWT_SECRET = "S3CRET";

mongoose.connect(`mongoose URL Here`)
app.use(express.json())

app.post("/api/v1/signup", async (req, res) => {
    try {
        const signupSchema = z.object({
            username: z.string().min(3, "The min size for username is 3").max(18, "The max size is 18"),
            password: z.string().min(6, "The password must be 6 chars long").max(18, "The max size is 18"),
        });

        const validationResult = signupSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(422).json({
                error: validationResult.error.errors.map((err) => err.message).join(", "),
            });
        }

        const { username, password } = validationResult.data;

        const checkUser = await UserModel.findOne({ username })

        if (checkUser) {
            return res.status(400).json({ message: "user already exists" })
        }

        const hashedPass = await bcrypt.hash(password, 8);


        await UserModel.create({
            username,
            password: hashedPass,
        });

        res.status(200).json({
            message: `You're    signed up, ${username}!`,
        });
    } catch (error) {
        if (error instanceof Error) {
            if ("code" in error && error.code === 11000) {
                res.status(400).json({ error: "Username already exists. Please use a different username." });
            } else {
                res.status(500).json({ error: `An error occurred: ${error.message}` });
            }
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
})

app.post("/api/v1/signin", async (req, res) => {

    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: "User does not exist",
        });
    }
    const verifiedPass = await bcrypt.compare(password, user.password);
    if (!verifiedPass) {
        res.status(401).json({
            message: "invalid creds"
        })
    }
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
    res.status(200).json({
        redirect: "ok",
        Message: `hello ${username}`,
        token: token
    })
})

app.post("/api/v1/content", Middle, async (req, res) => {
    const { title, link, type } = req.body;
    await ContentModel.create({
        title: title,
        link: link,
        type: type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    })
    res.json({
        message: "content created"
    })
})

app.get("/api/v1/content", Middle, async (req, res) => {
    //@ts-ignore
    const userId = req.userId
    const { type } = req.query;

    const query: { userId: any; type?: string } = { userId };

    if (type) {
        query.type = type as string;
    }

    const content = await ContentModel.find(query).populate("userId", "username");

    res.json({
        content
    })
})




app.delete("/api/v1/content", Middle, async (req, res) => {
    //@ts-ignore
    const contentId = req.body.contentId;

    await ContentModel.deleteOne({
        contentId,
        //@ts-ignore
        userId: req.userId
    })
    res.json({
        message: "deleted"
    })

})

app.post("/api/v1/brain/share", Middle, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const existhash = await LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        })
        if (existhash) {
            res.json({
                message: "share is on",
                hash: existhash.hash
            })
        } else {
            const hash = random(10)
            await LinkModel.create({
                //@ts-ignore
                userId: req.userId,
                hash: hash
            })
            res.json({
                message: "share is on",
                hash: hash
            })
        }
    } else {
        await LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        })
        res.json({
            message: "removed sharelink"
        })
    }
})

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash
    })
    if (!link) {
        res.status(411).json({
            message: "incorrect share link"
        })
        return;
    }
    const content = await ContentModel.find({
        userId: link.userId
    })
    const user = await UserModel.findOne({
        userId: link.userId
    })
    res.json({
        username: user?.username,
        content: content
    })
})


app.listen(3000)
