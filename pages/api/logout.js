import { withIronSessionApiRoute } from 'iron-session/next'
import { rejectUnauthorized, sessionInfo } from '/lib/session';

export default withIronSessionApiRoute(async (req, res) => {
    if(rejectUnauthorized(req, res)) return;

    await req.session.destroy();
    res.status(204).send();
}, sessionInfo);
