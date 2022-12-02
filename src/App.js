import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(
    JSON.parse(localStorage.getItem('myTasks')) || []
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: '',
    type: '',
  });

  // ADD ITEM
  const handelSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      // DISPLAY ALERT
      showAlert(true, 'please enter value', 'danger');
    } else if (name && isEditing) {
      // DEAL WITH EDIT
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'item updated', 'success');
    } else {
      // SHOW ALERT
      showAlert(true, 'item added to the list', 'success');

      // CREATE NEW ITEM
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      // EMPTY INPUT
      setName('');
    }
  };

  // CLEAR LIST
  const clearList = () => {
    showAlert(true, 'Empty list', 'danger');
    setList([]);
  };

  // REMOVE ITEM
  const removeItem = (id) => {
    showAlert(true, 'item removed', 'danger');
    setList(list.filter((item) => item.id !== id));
  };

  // EDIT ITEM
  const editItem = (id) => {
    const specialItem = list.find((item) => item.id === id);
    setEditID(specialItem.id);
    setName(specialItem.title);
    setIsEditing(true);
  };

  // SHOW ALERT METHOD
  const showAlert = (show = false, msg = '', type = '') => {
    return setAlert({ show, msg, type });
  };

  // ADD LIST TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('myTasks', JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="todo-form" onSubmit={handelSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} />}
        <h3>ToDo List</h3>
        <div className="form-control">
          <input
            type="text"
            className="todo"
            placeholder="e.g. Learn React"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="todo-container">
          <List
            items={list}
            removeItem={removeItem}
            list={list}
            editItem={editItem}
          />
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
