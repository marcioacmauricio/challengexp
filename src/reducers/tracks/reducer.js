import { READ_TRACKS, FETCH_TRACKS, NOTIFY_ERROR } from './types'

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

		case READ_TRACKS: 		
			newState.item = action.payload
			return newState		

		case FETCH_TRACKS: 
			newState.items = action.payload
			return newState	

		case NOTIFY_ERROR: 
			newState.erro = action.payload
			return newState	
				
		default: 
			return newState;
	}   
}