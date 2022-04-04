import { User } from "/lib/stuff";

export default async function handler(req, res) {
    if(req.method !== 'POST') {
        res.status(405).send();
        return;
    }
    if(!req.body.username || !req.body.password) {
        res.status(400).send();
        return;
    }

    const uid = await User.signup(req.body.username, req.body.password);
    if(!uid) {
        res.status(409).json({ message: "A user with that username already exists" });
        return;
    }

    res.status(200).send();
}