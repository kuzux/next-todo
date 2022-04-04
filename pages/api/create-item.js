// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Item } from "/lib/stuff";
import { rejectUnauthorized, sessionInfo } from '/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next'

export default withIronSessionApiRoute((req, res) => {
  if(req.method !== 'POST') {
    res.status(405).send();
    return;
  }
  if(rejectUnauthorized(req, res)) return;

  if(!req.body.name || !req.body.userId) {
    res.status(400).send();
    return;
  }

  const item = Item.addItem(req.body.name, req.body.userId);
  res.status(200).json(item);
}, sessionInfo);
