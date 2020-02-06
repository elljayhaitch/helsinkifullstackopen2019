import React from 'react';
import Person from './person';

const Persons = ({persons, filter, setPersons}) => (
	<div>
		{persons
	      	.filter(person => person.name.toUpperCase().includes(filter.toUpperCase()))
	      	.map(person => <Person key={person.name} person={person} persons={persons} setPersons={setPersons} />)}
	</div>
);

export default Persons;