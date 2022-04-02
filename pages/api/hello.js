// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Item } from "../../lib/stuff";

export default async function handler(req, res) {
  if(req.method !== 'POST') {
    res.status(405).send();
    return;
  }

  const item = await Item.create(req.body);
  res.status(200).json(item);
}
