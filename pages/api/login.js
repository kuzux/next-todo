import { withSessionInfo } from '/lib/session';
import { User } from '/lib/stuff';

export default withSessionInfo(async (req, res) => {
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