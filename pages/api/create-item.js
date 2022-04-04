// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Item } from "/lib/stuff";
import { rejectUnauthorized, withSessionInfo } from '/lib/session';
import { requireMethod, requireParameter } from "/lib/responseHelpers";

export default withSessionInfo((req, res) => {
  if(requireMethod(req, res, 'POST')) return;
  if(rejectUnauthorized(req, res)) return;

  if(requireParameter(req, res, 'name')) return;
  if(requireParameter(req, res, 'userId')) return;

  const item = Item.addItem(req.body.name, req.body.userId);
  res.status(200).json(item);
});
