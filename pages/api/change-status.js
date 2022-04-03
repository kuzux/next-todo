import { Item } from "/lib/stuff";

export default async function handler(req, res) {
    if(req.method !== 'POST') {
        res.status(405).send();
        return;
    }
    const id = req.body.id;
    const status = req.body.status;
    if(status < 0 || status > Item.statuses.length) {
        res.status(400).send();
        return;
    }

    const succ = Item.changeStatus(id, status);

    if(succ)
        res.status(204).send();
    else
        res.status(404).send();
}
