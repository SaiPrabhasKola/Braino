import express, { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
const JWT_SECRET = "S3CRET"


export const Middle = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_SECRET);
    if (decoded) {
        //@ts-ignore
        req.userId = decoded.id;
        next()
    } else {
        res.status(403).json({
            message: "you're not signed in"
        })
    }
}