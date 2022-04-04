export const sessionInfo = {
    password: 'Frjr2nmBergaBUiWVyQYYrEpiJ4bt6Lq',
    cookieName: 'next-todo',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    }
};

export const isAuthorized = (req) => {
    const user = req.session?.user;
    return !!user;
}

// returns true if rejected
export const rejectUnauthorized = (req, res) => {
    if(!isAuthorized(req)) {
        res.status(401).json({ error: "Not logged in" });
        return true;
    }

    return false;
}
