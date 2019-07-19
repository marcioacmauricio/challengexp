import { READ_ALBUMS, FETCH_ALBUMS } from './types'


export const readAlbums = (albumsId) => dispatch => {
	fetch('http://localhost:8081/albums/' + albumsId)
	.then(
		res => res.json()
	)
	.then(
		albumsItem => dispatch({
			type: READ_ALBUMS,
			payload: albumsItem
		})
	);
}



export const fetchAlbums = (todoData) => dispatch => {
	fetch('http://localhost:8081/albums', { 
		method : 'POST',
			headers : {
				'content-type': 'Application/json'
			},
			body: JSON.stringify(todoData)
		})
		.then(
			res => res.json()
		)
		.then(
			albumsList => dispatch({
			type: FETCH_ALBUMS,
			payload: albumsList
		})
	);
}