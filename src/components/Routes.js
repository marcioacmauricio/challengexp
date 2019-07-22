import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import {
	albumsList,
	albumsView
} from '../containers/albums'

const Routes = () => (
	<main>
		<Switch>
			<Route exact path='/' component={Home}/>
			<Route exact path='/albums/:artist' component={albumsList}/>
			<Route exact path='/albums/:artist/:id' component={albumsView}/>
		</Switch>
	</main>
)

export default Routes
