import { READ_ALBUMS, FETCH_ALBUMS, NOTIFY_ERROR } from './types'

const initialState = {
	items: [], 
	item: {},
	erro: {},
	queryParams: {}
};

export default function (state = initialState, action) {
	const newState = { ...state }
	newState.queryParams = action.queryParams

	switch(action.type) {

		case READ_ALBUMS: 		
			newState.item = action.payload
			return newState		

		case FETCH_ALBUMS: 
			newState.items = action.payload
			return newState	

		case NOTIFY_ERROR: 
			newState.erro = action.payload
			return newState	
				
		default: 
			return newState;
	}   
}