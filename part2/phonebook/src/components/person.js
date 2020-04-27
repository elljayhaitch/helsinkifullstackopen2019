import React from 'react';
import personsService from '../services/personsService'

const removePerson = (person, persons, setPersons, setNotification) => {
	if (window.confirm(`Delete ${person.name}?`)) { 
		personsService
		.remove(person.id)
		.then(status => {
		  	const newPersons = persons.filter(p => p.id !== person.id);
		    setPersons(newPersons);
		})
		.catch(error => setNotification('could not delete', true));
	}
};

const Person = ({person, persons, setPersons, setNotification}) => (
	<div>
		{person.name} {person.number}
		<button onClick={() => removePerson(person, persons, setPersons, setNotification)}>delete</button>
	</div>
);

export default Person;