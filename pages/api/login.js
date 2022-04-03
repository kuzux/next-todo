import { withIronSessionApiRoute } from 'iron-session/next'

export default withIronSessionApiRoute(async (req, res) => {
    const { username, password } = req.body;
    if(password == 'rosebud') {
        req.session.user = username;
        await req.session.save();
        res.json({ username });
    } else {
        res.status(401).json({ error: "Wrong password" })
    }
}, {
    password: 'Frjr2nmBergaBUiWVyQYYrEpiJ4bt6Lq',
    cookieName: 'next-todo'
});