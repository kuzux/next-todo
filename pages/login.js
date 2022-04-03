import Router from 'next/router';
import { useState } from 'react';

export default function Login() {
    const [error, setError] =  useState(null);
    let errorElem;
    if(error) {
        errorElem = <p className="bg-red-200 border border-red-500 p-2 mb-4">{error}</p>;
    }

    return <div className="grid grid-cols-1 place-items-center">
        <form className="block p-6 rounded shadow bg-white max-w-sm" onSubmit={async (event) => {
            event.preventDefault();

            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: event.target.username.value,
                    password: event.target.password.value
                })
            });

            if(res.status < 300) {
                Router.push("/");
            } else {
                const data = await res.json();
                console.log(data);
                setError(data.error);
            }
        }}>
            {errorElem}
            <div className="form-group mb-6">
                <label htmlFor="username" className="form-label">Username</label>
                <input name="username" className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
            </div>
            <div className="form-group mb-6">
                <label htmlFor="password" className="form-label">Password</label>
                <input name="password" className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" />
            </div>
            <button type="submit" className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 border border-pink-700 rounded">Login</button>
        </form>
    </div>
}
