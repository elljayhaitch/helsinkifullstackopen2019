import React from 'react';

import personsService from '../services/personsService'

const removePerson = (person, persons, setPersons) => {
	if (window.confirm(`Delete ${person.name}?`)) { 
		personsService
		.remove(person.id)
		.then(status => {
			// on successful delete, set persons in state
		  	const newPersons = persons.filter(p => p.id !== person.id);
		    setPersons(newPersons);
		})
		.catch(error => alert('could not delete'));
	}
};

const Persons = ({persons, filter, setPersons}) => (
<div>
	{persons
      	.filter(person => person.name.toUpperCase().includes(filter.toUpperCase()))
      	.map(person => <Person key={person.name} person={person} persons={persons} setPersons={setPersons} />)}
</div>
);

const Person = ({person, persons, setPersons}) => (
	<div>
		{person.name} {person.number}
		<button onClick={() => removePerson(person, persons, setPersons)}>delete</button>
	</div>
);

export default Persons;