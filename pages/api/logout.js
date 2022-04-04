import { rejectUnauthorized, withSessionInfo } from '/lib/session';
import { requireMethod } from "/lib/responseHelpers";

export default withSessionInfo(async (req, res) => {
    if(requireMethod(req, res, 'POST')) return;
    if(rejectUnauthorized(req, res)) return;

    await req.session.destroy();
    res.status(204).send();
});
