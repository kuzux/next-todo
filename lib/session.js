import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'

const sessionInfo = {
    password: 'Frjr2nmBergaBUiWVyQYYrEpiJ4bt6Lq',
    cookieName: 'next-todo',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    }
};

export const withSessionInfo = (handler) => {
    return (reqOrCtx, res_) => {
        if(res_) {
            // api route
            const req = reqOrCtx;
            const res = res_;
            return withIronSessionApiRoute(handler, sessionInfo)(req, res);
        } else {
            // regular page
            const ctx = reqOrCtx;
            return withIronSessionSsr(handler, sessionInfo)(ctx);
        }
    }
}

// returns true if rejected
export const rejectUnauthorized = (req, res) => {
    const user = req.session?.user;

    if(!user) {
        if(req.url.startsWith("/api/")) {
            res.status(401).json({ error: "Not logged in" });
        } else {
            res.setHeader('location', '/login');
            res.statusCode = 302;
            res.end();
        }
        return true;
    }

    return false;
}
