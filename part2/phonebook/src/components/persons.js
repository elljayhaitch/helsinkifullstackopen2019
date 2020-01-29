import React from 'react';

const Persons = ({persons, filter}) => (
<div>
	{persons
      	.filter(person => person.name.toUpperCase().includes(filter.toUpperCase()))
      	.map(person => <Person key={person.name} person={person} />)}
</div>
);

const Person = ({person}) => (<p>{person.name} {person.number}</p>);

export default Persons;