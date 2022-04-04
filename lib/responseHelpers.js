// all functions in the module return true if they returned a response
// so they can be used like if(denyRequest(req, res)) return;
// in handlers

export function requireMethod(req, res, method) {
    if(req.method !== method) {
        res.status(405).send();
        return true;
    }
    return false;
}

export function requireParameter(req, res, param, msg = null) {
    if(!msg) msg = `Required parameter: ${param}`;

    if(!req.body[param]) {
        res.status(400).json({ error: msg });
        return true;
    }
    return false;
}