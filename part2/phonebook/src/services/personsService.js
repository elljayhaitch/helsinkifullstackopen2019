import axios from 'axios'

const personsBaseUrl = 'http://localhost:3001/persons';

const getAll = () => {
	const request = axios.get(personsBaseUrl);
	return request.then(response => response.data);
};

const create = newPerson => {
	const request = axios.post(personsBaseUrl, newPerson);
	return request.then(response => response.data);
};

const remove = id => {
	const request = axios.delete(`${personsBaseUrl}/${id}`);
	return request.then(response => response.status);
};

const update = newPerson => {
	const request = axios.put(`${personsBaseUrl}/${newPerson.id}`, newPerson);
	return request.then(response => response.data);
};

const personsService = { getAll, create, remove, update };

export default personsService;

