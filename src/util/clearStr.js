import inflection from 'inflection'
export default function clearStr( Str ) {
	if (typeof Str === 'string'){
		let Ret = Str.replace(/[^\w\s]/gi, '')
		return inflection.dasherize(Ret).toLowerCase()
	} else {
		return ""
	}
};