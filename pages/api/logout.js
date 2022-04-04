import { rejectUnauthorized, withSessionInfo } from '/lib/session';

export default withSessionInfo(async (req, res) => {
    if(rejectUnauthorized(req, res)) return;

    await req.session.destroy();
    res.status(204).send();
});
