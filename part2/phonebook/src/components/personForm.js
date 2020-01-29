import React from 'react';

const PersonForm = ({newName, setNewName, newNumber, setNewNumber, persons, setPersons}) => {
  const onClick = event => {
		event.preventDefault();

		if (persons.some(person => person.name.toUpperCase() === newName.toUpperCase())) {
			alert(`${newName} is already added to phonebook`);
		} else {
			const newPerson = { name: newName, number: newNumber };
			const newPersons = persons.concat(newPerson);
			setPersons(newPersons);
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