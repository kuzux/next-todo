import { withSessionInfo } from '/lib/session';
import { User } from '/lib/stuff';
import { requireMethod, requireParameter } from "/lib/responseHelpers";

export default withSessionInfo(async (req, res) => {
    if(requireMethod(req, res, 'POST')) return;
    
    if(requireParameter(req, res, 'username')) return;
    if(requireParameter(req, res, 'password')) return;
    const { username, password } = req.body;

    const id = await User.verify(username, password);
    if(id) {
        req.session.user = User.getById(id);
        await req.session.save();
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ error: "Wrong usename/password" });
    }
});