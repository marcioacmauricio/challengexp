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
			<Route exact path='/albums' component={albumsList}/>
			<Route path='/albums/:id' component={albumsView}/>
		</Switch>
	</main>
)

export default Routes
