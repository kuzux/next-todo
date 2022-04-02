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

  const createItem = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const date = new Date().toISOString();
    const temp = { id: crypto.randomUUID(), name: name, createdAt: date, status: -1, loading: true };

    // We add a preliminary item, and "fix" its status after receiving the response
    const tmpItems = [...items, temp];
    setItems(tmpItems);

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

    const newItems = tmpItems.map((i) => {
      if(i.id == temp.id) return newItem;
      else return i;
    });

    setItems(newItems);
    console.log(newItems);
  };

  const changeStatus = async (id, newStatus) => {
    const item = items.find(i => i.id === id);
    
    const tmpItem = { ...item, status: newStatus, loading: true };
    const tmpItems = items.map(i => {
      if(i.id === id) return tmpItem;
      else return i;
    });
    setItems(tmpItems);
    
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

    console.log(item);
    console.log(newItem);
    const newItems = items.map(i => {
      if(i.id === id) return newItem;
      else return i;
    });
    setItems(newItems);
  }

  const itemElems = items.map((item) => {
    let button;
    let checkbox;

    if(item.status === 0 || item.status === 1) {
      checkbox = <input type="checkbox" checked={item.status === 1} onChange={ evt => {
        let newStatus = 0;
        if(evt.target.checked) newStatus = 1;
        changeStatus(item.id, newStatus);
      }} />;
    }

    let classes = ["grid", "grid-cols-3", "gap-4"];
    if(item.status === 1 || item.status === 2) {
      classes.push('text-gray-600');
    }
    if(item.status === 1) {
      classes.push('line-through');
    }
    if(item.error) {
      classes.push('underline');
      classes.push('text-red-600');
      classes.push('font-bold');
    }

    if(item.status === 0) button = <button onClick={() => changeStatus(item.id, 2)} disabled={item.loading}>❌</button>
    if(item.error) button = <button onClick={() => {
      if(item.error === "create") console.log("TODO: retry createItem here");
      else changeStatus(item.id, item.status)
    }}>🔄</button>

    return <div key={item.id} className={classes.join(' ')}>
      <div className="text-right">{checkbox}</div>
      <div>{item.name}</div>
      <div>{button}</div>
    </div>;
  });

  return (<div className="grid place-items-center">
      <div className="shadow border rounded w-6/12 mb-4 py-4 bg-white">
        {itemElems}
      </div>

      <form onSubmit = {createItem}>
        <input name="name" className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" required />
        <button type="submit" className="bg-white hover:bg-pink-500 text-pink-500 hover:text-white font-bold py-2 px-4 border border-pink-700 rounded">Create New Item</button>
      </form>
  </div>);
}

export async function getServerSideProps(context) {
  const items = await Item.findAll({ raw: true });
  return { props: { items } };
}
