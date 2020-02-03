import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'

import './index.css';
import Filter from './components/filter';
import PersonForm from './components/personForm';
import Persons from './components/persons';

const App = () => {
  const [ persons, setPersons] = useState([]);

  const hook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  };

  useEffect(hook, [])

  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');

  const personFormProps = {
  	newName, setNewName,
  	newNumber, setNewNumber,
  	persons, setPersons
  };

	return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />

      <h3>add a new</h3>
      <PersonForm {...personFormProps} />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));