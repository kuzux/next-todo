import { useEffect, useState } from 'react'
import Router from 'next/router';
import { Item } from '/lib/stuff'
import { withSessionInfo, rejectUnauthorized } from '/lib/session';

export default function Home(props) {
    // [{ id?, name, status, userId, createdAt, loading?, error? }]
    const [items, setItems] = useState(props.items);

    // takes the item as an object
    // if the object already has an id, replaces the item with that id first (for retries)
    // if not, generates a temporary id for the item (until response is received) and adds it to the end
    const createItem = async (item) => {
        const date = new Date().toISOString();
        item.createdAt = date;

        if(item.id === undefined || item.id === null) {
            const temp = { ...item, id: crypto.randomUUID(), status: -1, loading: true, error: null };
            item = temp;

            // We add a preliminary item, and "fix" its status after receiving the response
            setItems((items) => [...items, temp]);
        } else {
            setItems((items) => {
                return items.map((i) => {
                    if(i.id == item.id) return item;
                    else return i;
                });
            });
        }

        const res = await fetch('/api/create-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: item.name,
                userId: item.userId
            })
        });

        let newItem;
        if(res.status >= 300) {
            newItem = { ...item, loading: false, error: "create" };
        } else {
            newItem = await res.json();
        }

        setItems((items) => {
            return items.map((i) => {
                if(i.id == item.id) return newItem;
                else return i;
            });
        });
    };

    const changeStatus = async (id, newStatus) => {
        const item = items.find(i => i.id === id);
    
        const tmpItem = { ...item, status: newStatus, loading: true };
        setItems((items) => {
            return items.map(i => {
                if(i.id === id) return tmpItem;
                else return i;
            });
        });
    
        const res = await fetch('/api/change-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                status: newStatus
            })
        });

        let newItem;
        if(res.status >= 300) {
            newItem = { ...item, loading: false, status: newStatus, error: "change-status" };
        } else {
            newItem = { ...item, loading: false, status: newStatus, error: null };
        }

        setItems((items) => {
            return items.map(i => {
                if(i.id === id) return newItem;
                else return i;
            });
        });
    }

    const deleteItem = async (id) => {
        const item = items.find(i => i.id === id);
        setItems((items) => {
            return items.filter(i => i.id !== id);
        });

        const res = await fetch('/api/change-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                status: Item.statuses.deleted
            })
        });

        if(res.status >= 300) {
            const newItem = { ...item, error: 'delete' }
            setItems((items) => [...items, newItem]);
        }
    }

    const logout = async () => {
        const res = await fetch('/api/logout', {
            method: 'POST'
        });

        if(res.status < 300) Router.push("/login");
    }

    const itemElems = items.map((item) => {
        let button;
        let checkbox;

        if(item.status === Item.statuses.todo || item.status === Item.statuses.completed) {
            checkbox = <input type="checkbox" checked={item.status === Item.statuses.completed} onChange={ evt => {
                let newStatus = Item.statuses.todo;
                if(evt.target.checked) newStatus = Item.statuses.completed;
                changeStatus(item.id, newStatus);
            }} />;
        }

        let classes = ["todo-item", "grid", "grid-cols-3", "gap-2", "group", "hover:bg-gray-50", "py-1"];
        if(item.status === Item.statuses.completed) {
            classes.push('text-gray-600');
            classes.push('line-through');
        }
        if( item.status === Item.statuses.ignored) {
            classes.push('text-gray-400');
        }
        if(item.error) {
            classes.push('underline');
            classes.push('text-red-600');
            classes.push('font-bold');
        }

        if(item.status === Item.statuses.todo)
            button = <button value="ignore" 
                onClick={() => changeStatus(item.id, Item.statuses.ignored)} disabled={item.loading}>❌</button>;
        if(item.status === Item.statuses.completed)
            button = <button value="delete"
                onClick={() => deleteItem(item.id)} disabled={item.loading}>🗑</button>;
        if(item.status === Item.statuses.ignored)
            button = <>
                <button value="ignore"
                    onClick={() => changeStatus(item.id, Item.statuses.todo)} disabled={item.loading}>Undo</button>
                <button value="delete"
                    className="mx-4" onClick={() => deleteItem(item.id)} disabled={item.loading}>Delete</button>
            </>;

        if(item.error) button = <button value="retry" onClick={async () => {
            if(item.error === "create") {
                createItem(item);
            } else if(item.error === "delete") {
                deleteItem(item.id);
            } else {
                changeStatus(item.id, item.status);
            }
        }}>🔄</button>

        return <div key={item.id} className={classes.join(' ')}>
            <div className="text-right invisible group-hover:visible">{checkbox}</div>
            <div>{item.name}</div>
            <div className="invisible group-hover:visible">{button}</div>
        </div>;
    });

    return (<div className="grid grid-cols-1 place-items-center">
        <p className="my-2">
        Logged in as {props.user.username}
            <button className="bg-white hover:bg-pink-500 text-pink-500 hover:text-white py-1 px-2 mx-4 border border-pink-700 rounded" onClick={logout}>Logout</button>
        </p>

        <div className="shadow border rounded w-6/12 mb-4 py-4 bg-white">
            {itemElems}
        </div>

        <form onSubmit = {(evt) => {
            evt.preventDefault();
            createItem({ name: evt.target.name.value, userId: props.user.id });
        }}>
            <input name="name" className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" required />
            <button type="submit" value="add" className="bg-white hover:bg-pink-500 text-pink-500 hover:text-white font-bold py-2 px-4 mx-4 border border-pink-700 rounded">Create New Item</button>
        </form>
    </div>);
}

export const getServerSideProps = withSessionInfo(async function ({ req, res }) {
    if(rejectUnauthorized(req, res)) return { props: {} };

    const user = req.session.user;
    const items = Item.itemsByUser(user.id);
    return { props: { items, user } };
});
