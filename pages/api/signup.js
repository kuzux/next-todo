import { User } from "/lib/stuff";
import { requireMethod, requireParameter } from "/lib/responseHelpers";

export default async function handler(req, res) {
    if(requireMethod(req, res, 'POST')) return;

    if(requireParameter(req, res, 'username')) return;
    if(requireParameter(req, res, 'password')) return;

    const uid = await User.signup(req.body.username, req.body.password);
    if(!uid) {
        res.status(409).json({ message: "A user with that username already exists" });
        return;
    }

    res.status(200).send();
}