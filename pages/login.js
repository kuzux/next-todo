import Router from 'next/router';
import { useState } from 'react';
import login from './api/login';

export default function Login() {
    const [notice, setNotice] = useState(null);
    const [error, setError] = useState(null);
    
    let errorElem;
    if(error) {
        errorElem = <p className="bg-red-200 border border-red-500 p-2 mb-4">{error}</p>;
    }
    else if(notice) {
        errorElem = <p className="bg-green-200 border border-green-500 p-2 mb-4">{notice}</p>;
    }

    const login = async (username, password) => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if(res.status < 300) {
            Router.push("/");
        } else {
            const data = await res.json();
            setError(data.error);
        }
    }

    const signup = async (username, password) => {
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if(res.status < 300) {
            setNotice("Successfully signed up");
        } else {
            const data = await res.json();
            setError(data.error);
        }
    }

    return <div className="grid grid-cols-1 place-items-center">
        <form className="block p-6 rounded shadow bg-white max-w-sm" onSubmit={async (event) => {
            event.preventDefault();

            const action = event.nativeEvent.submitter.value;
            if(action === "login") await login(event.target.username.value, event.target.password.value);
            else await signup(event.target.username.value, event.target.password.value);            
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
            <button type="submit" value="login" className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 mx-2 border border-pink-700 rounded">Login</button>
            <button type="submit" value="signup" className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 mx-2 border border-pink-700 rounded">Signup</button>
        </form>
    </div>
}
