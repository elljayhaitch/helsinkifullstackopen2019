import React from 'react'

const Header = (props) => (<h1>{props.course}</h1>);

const Part = ({part}) => (<p>{part.name} {part.exercises}</p>);

const Content = ({parts}) => (<>{parts.map(part => (<Part key={part.id} part={part} />))}</>);

const sumCallback = ( acc, cur ) => acc + cur.exercises;

const Total = ({parts}) => (<p>Number of exercises {parts.reduce(sumCallback, 0)}</p>);

const Course = ({course}) => (
	<>
	  <Header course={course.name} />
	  <Content parts={course.parts} />
	  <Total parts={course.parts} />
	</>
);

export default Course;