import React from 'react';
import Person from './person';

const Persons = ({persons, filter, setPersons, setNotification}) => (
	<div>
		{persons
	      	.filter(person => person.name.toUpperCase().includes(filter.toUpperCase()))
	      	.map(person => <Person key={person.name} person={person} persons={persons} setPersons={setPersons} setNotification={setNotification} />)}
	</div>
);

export default Persons;