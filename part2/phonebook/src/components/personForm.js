import React from 'react';
import personsService from '../services/personsService';

const personMatch = (person, newName) => person.name.toUpperCase() === newName.toUpperCase();

const updatePerson = (newName, setNewName, newNumber, setNewNumber, persons, setPersons, setMessage) => {
	const person = persons.filter(person => personMatch(person, newName))[0];

	if (person.number === newNumber) {
		alert(`${newName} is already added to phonebook`);
	} else if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {			
		personsService
		.update({...person, number: newNumber})
		.then(updated => {
		  	const newPersons = persons.map(p => p.id !== person.id ? p : updated);
		    setPersons(newPersons);
		    setNewName('');
			setNewNumber('');
			setNotification(`Updated ${newName}`, setMessage);
		})
		.catch(error => alert('could not update'));
	}
};

const createPerson = (newName, setNewName, newNumber, setNewNumber, persons, setPersons, setMessage) => {	
	personsService
		.create({ name: newName, number: newNumber })
		.then(saved => {
		  	const newPersons = persons.concat(saved);
		    setPersons(newPersons);
		    setNewName('');
			setNewNumber('');
			setNotification(`Added ${newName}`, setMessage);
		})
		.catch(error => alert('could not create'));
};

const setNotification = (notification, setMessage) => {
	setMessage(notification);
	setTimeout(() => setMessage(null), 5000);
}

const PersonForm = ({newName, setNewName, newNumber, setNewNumber, persons, setPersons, setMessage}) => {
	const onClick = event => {
		event.preventDefault();

		if (persons.some(person => personMatch(person, newName))) {
			updatePerson(newName, setNewName, newNumber, setNewNumber, persons, setPersons, setMessage);
		} else {
			createPerson(newName, setNewName, newNumber, setNewNumber, persons, setPersons, setMessage);
		}
	};

	return (
		<form>
	        <div>
	          name: 
	          <input 
	          value={newName}
	          onChange={event => setNewName(event.target.value)}
	          />
	        </div>

	        <div>
	          number: 
	          <input 
	          value={newNumber}
	          onChange={event => setNewNumber(event.target.value)}
	          />
	        </div>

	        <div>
	          <button type="submit" onClick={onClick}>add</button>
	        </div>
	      </form>
	);
};

export default PersonForm;