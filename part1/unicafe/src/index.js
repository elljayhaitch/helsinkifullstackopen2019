import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const getTotal = (good, neutral, bad) => good + neutral + bad;

const getAverage = (good, neutral, bad) => {
	// good: 1, neutral: 0, bad: -1
	let total = getTotal(good, neutral, bad);
	if (total === 0)
	{
		return 0;
	}

	return (good - bad)/total;
};

const getPositive = (good, neutral, bad) => {
	let total = getTotal(good, neutral, bad);
	if (total === 0)
	{
		return "0 %";
	}

	return (good/total) * 100 + " %";
};

const Button = ({text, clickHandler}) => (
	<button onClick={clickHandler}>{text}</button>
);

const Statistic = ({text, value}) => (
	<p>{text} {value}</p>
);

const Statistics = ({good, neutral, bad}) => {
	if(getTotal(good, neutral, bad) === 0)
	{
		return (<p>No feedback given</p>);
	}

	return (
	<>
		<Statistic text="good" value={good} />
		<Statistic text="neutral" value={neutral} />
		<Statistic text="bad" value={bad} />
		<Statistic text="all" value={getTotal(good, neutral, bad)} />
		<Statistic text="average" value={getAverage(good, neutral, bad)} />
		<Statistic text="positive" value={getPositive(good, neutral, bad)} />
	</>
	);
};

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
    	<h2>give feedback</h2>
		<Button text="good" clickHandler={() => setGood(good + 1)}/>
		<Button text="neutral" clickHandler={() => setNeutral(neutral + 1)}/>
		<Button text="bad" clickHandler={() => setBad(bad + 1)}/>

		<h2>statistics</h2>
		<Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)