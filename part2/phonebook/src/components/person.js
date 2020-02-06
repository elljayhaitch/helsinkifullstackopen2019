import React from 'react';
import personsService from '../services/personsService'

const removePerson = (person, persons, setPersons) => {
	if (window.confirm(`Delete ${person.name}?`)) { 
		personsService
		.remove(person.id)
		.then(status => {
		  	const newPersons = persons.filter(p => p.id !== person.id);
		    setPersons(newPersons);
		})
		.catch(error => alert('could not delete'));
	}
};

const Person = ({person, persons, setPersons}) => (
	<div>
		{person.name} {person.number}
		<button onClick={() => removePerson(person, persons, setPersons)}>delete</button>
	</div>
);

export default Person;