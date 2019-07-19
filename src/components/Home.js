import React from 'react';
import { Link } from 'react-router-dom'
const Home = (props) => {
	return (
		<div>
			Pesquise por um artista ou album para encontrar a sua música!
			<Link className="link" to='/albums'>Testar rota de lista</Link>
			<Link className="link" to='/albums/Black Album'>Testar rota de item</Link>
		</div>
	);
};

export default Home;