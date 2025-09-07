import Session from "../models/Session.js";

export default async (req, res, next) => {
    try {
        if (!req.signedCookies.sid) {
            const session = await Session.create({});
            console.log(session);
            res.cookie("sid", session.id, {
                httpOnly: true,
                signed: true,
                maxAge: 1000 * 60 * 60,
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}