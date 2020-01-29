import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const App = () => {
  const [ persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [ newName, setNewName ] = useState('')

  const onClick = event => {
		event.preventDefault();

		if (!persons.includes(person => person.name === newName))
		{
			const newPerson = { name: newName };
			const newPersons = persons.concat(newPerson);
			setPersons(newPersons);
		}
	};

	const onChange = event => {
		setNewName(event.target.value);
	};

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: 
          <input 
          value={newName}
          onChange={onChange}
          />
        </div>
        <div>
          <button type="submit" onClick={onClick}>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => <p key={person.name}>{person.name}</p>)}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
// export default App