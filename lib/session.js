// TODO: create a function to choose a wrapper and pass the options
export const sessionInfo = {
    password: 'Frjr2nmBergaBUiWVyQYYrEpiJ4bt6Lq',
    cookieName: 'next-todo',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    }
};

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
