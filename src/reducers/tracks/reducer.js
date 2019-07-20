import { READ_TRACKS, FETCH_TRACKS } from './types'

const initialState = {
	items: [], 
	item: {}
};

export default function (state = initialState, action) {
	switch(action.type) {
		case READ_TRACKS: 
			return { 
				...state,
				item: action.payload
			};			
		case FETCH_TRACKS: 
			return {
				...state,
				items: action.payload
			};
		default: 
			return state;
	}   
}