import { READ_ALBUMS, FETCH_ALBUMS } from './types'

const initialState = {
	items: [], 
	item: {}
};

export default function (state = initialState, action) {
	switch(action.type) {
		case READ_ALBUMS: 
			return { 
				...state,
				item: action.payload
			};			
		case FETCH_ALBUMS: 
			return {
				...state,
				items: action.payload
			};
		default: 
			return state;
	}   
}