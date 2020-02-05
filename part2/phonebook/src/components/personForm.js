import React from 'react';
import personsService from '../services/personsService'

const personMatch = (person, newName) => person.name.toUpperCase() === newName.toUpperCase()

const PersonForm = ({newName, setNewName, newNumber, setNewNumber, persons, setPersons}) => {
  const onClick = event => {
		event.preventDefault();

		// existing person
		if (persons.some(person => personMatch(person, newName))) {
			const person = persons.filter(person => personMatch(person, newName))[0];

			if (person.number === newNumber) {
				// person already exists, and no number to overwrite, allow user to blank existing
				alert(`${newName} is already added to phonebook`);
			} else {
				// person already exists, and has a number to overwrite
				if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) { 
					const editedPerson = {...person, number: newNumber}

					personsService
					.update(editedPerson)
					.then(updated => {
						// on successful put, set persons in state
					  	const newPersons = persons.map(p => p.id !== person.id ? p : updated);
					    setPersons(newPersons);

					    // and reset name and number in state
					    setNewName('');
					    setNewNumber('');
					})
					.catch(error => alert('could not update'));
				}
			}
		// new person
		} else {
			const newPerson = { name: newName, number: newNumber };

			personsService
				.create(newPerson)
				.then(saved => {
					// on successful save, set persons in state
				  	const newPersons = persons.concat(saved);
				    setPersons(newPersons);

				    // and reset name and number in state
				    setNewName('');
				    setNewNumber('');
				})
				.catch(error => alert('could not create'));
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