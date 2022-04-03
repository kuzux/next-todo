import { withIronSessionApiRoute } from 'iron-session/next'

export default withIronSessionApiRoute(async (req, res) => {
    await req.session.destroy();
    res.status(204).send();
}, {
    password: 'Frjr2nmBergaBUiWVyQYYrEpiJ4bt6Lq',
    cookieName: 'next-todo'
});
