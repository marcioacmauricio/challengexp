import React from 'react'
import { Switch, Route } from 'react-router-dom'
import {
	albumsList,
	albumsView
} from '../containers/albums'

const Routes = () => (
	<main>
		<Switch>
			<Route exact path='/' component={albumsList}/>
			<Route exact path='/albums' component={albumsList}/>
			<Route path='/albums/:id' component={albumsView}/>
		</Switch>
	</main>
)

export default Routes
