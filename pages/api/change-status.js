import { Item } from "/lib/stuff";
import { rejectUnauthorized, withSessionInfo } from '/lib/session';
import { requireMethod, requireParameter } from "/lib/responseHelpers";

export default withSessionInfo((req, res) => {
    if(requireMethod(req, res, 'POST')) return;
    if(rejectUnauthorized(req, res)) return;

    if(requireParameter(req, res, 'id')) return;
    if(requireParameter(req, res, 'status')) return;
    const { id, status } = req.body;
    
    if(status < 0 || status > Item.statuses.length) {
        res.status(400).json({ error: "Invalid status value" });
        return;
    }

    const succ = Item.changeStatus(id, status);

    if(succ)
        res.status(204).send();
    else
        res.status(404).send();
});
