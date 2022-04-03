import { useEffect, useState } from 'react'
import { Item } from '/lib/stuff'

export default function Home(props) {
  const [items, setItems] = useState(props.items);

  useEffect(() => {
    fetch('/api/change-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }, []);

  const createItem = async (name) => {
    const date = new Date().toISOString();
    const temp = { id: crypto.randomUUID(), name: name, createdAt: date, status: -1, loading: true };

    // We add a preliminary item, and "fix" its status after receiving the response
    setItems((items) => [...items, temp]);

    const res = await fetch('/api/create-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name
      })
    });

    let newItem;
    if(res.status >= 300) {
      newItem = { ...temp, error: "create" };
    } else {
      newItem = await res.json();
    }

    setItems((items) => {
      return items.map((i) => {
        if(i.id == temp.id) return newItem;
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
      newItem = { ...item, status: newStatus, error: "change-status" };
    } else {
      newItem = { ...item, status: newStatus, error: null };
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

    let classes = ["grid", "grid-cols-3", "gap-2", "group", "hover:bg-gray-50", "py-1"];
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

    if(item.status === Item.statuses.todo) button = <button onClick={() => changeStatus(item.id, Item.statuses.ignored)} disabled={item.loading}>❌</button>
    if(item.status === Item.statuses.ignored) button = <button onClick={() => deleteItem(item.id)} disabled={item.loading}>🗑</button>
    if(item.error) button = <button onClick={async () => {
      if(item.error === "create") {
        const newItems = items.filter((i) => i.id !== item.id);
        setItems(newItems);
        createItem(item.name);
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

  return (<div className="grid place-items-center">
      <div className="shadow border rounded w-6/12 mb-4 py-4 bg-white">
        {itemElems}
      </div>

      <form onSubmit = {(evt) => {
        evt.preventDefault();
        createItem(evt.target.name.value);
      }}>
        <input name="name" className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" required />
        <button type="submit" className="bg-white hover:bg-pink-500 text-pink-500 hover:text-white font-bold py-2 px-4 border border-pink-700 rounded">Create New Item</button>
      </form>
  </div>);
}

export async function getServerSideProps(context) {
  const items = Item.allItems();
  return { props: { items } };
}
