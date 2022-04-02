import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Item } from '../lib/stuff'
import styles from '../styles/Home.module.css'
import { za } from '/lib/stuff'

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

    const res = await fetch('/api/hello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name
      })
    });
    const newItem = await res.json();
    // TODO: Handle failure cases as well

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
    
    const res = fetch('/api/change-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        status: newStatus
      })
    });
    // TODO: Handle failure case here as well

    const newItem = { ...item, status: newStatus };
    const newItems = items.map(i => {
      if(i.id === id) return newItem;
      else return i;
    });
    setItems(newItems);
  }

  const itemElems = items.map((item) => {
    let button;
    
    if(item.status === 0) button = <>
      <button onClick={() => changeStatus(item.id, 1)} disabled={item.loading}>Complete</button>
      <button onClick={() => changeStatus(item.id, 2)} disabled={item.loading}>Ignore</button>
    </>;

    return <li key={item.id}>
      {item.name}
      {button}
    </li>;
  });

  return (
    <div className={styles.container}>
      <ul>
        {itemElems}
      </ul>
      <p>{props.za}</p>
      <form onSubmit = {createItem}>
        <input name="name" type="text" required />
        <button type="submit">Create New Item</button>
      </form>
    </div>
  )
}

export async function getServerSideProps(context) {
  const items = await Item.findAll({ raw: true });
  return { props: { items, za } };
}
