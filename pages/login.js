import Router from 'next/router';

export default function Login() {
    return <form onSubmit={async (event) => {
        event.preventDefault();

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: event.target.username.value,
                password: event.target.password.value
            })
        });

        if(res.status < 300) Router.push("/");
    }}>
        <input name="username" type="text" />
        <input name="password" type="password" />
        <button type="submit">Login</button>
    </form>
}