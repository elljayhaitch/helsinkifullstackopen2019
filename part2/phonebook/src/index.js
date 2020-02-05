import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import Filter from './components/filter';
import PersonForm from './components/personForm';
import Persons from './components/persons';
import personsService from './services/personsService'

const App = () => {
  const [ persons, setPersons] = useState([]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');

  const getAllHook = () => {
    personsService
      .getAll()
      .then(results => setPersons(results))
      .catch(error => console.log('could not get all'));
  };
  useEffect(getAllHook, [])

  const personFormProps = { newName, setNewName, newNumber, setNewNumber, persons, setPersons };

	return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />

      <h3>add a new</h3>
      <PersonForm {...personFormProps} />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} setPersons={setPersons} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));