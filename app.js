var indexTemplate = require('./main.ract').template
var Ractive = require('ractive')

var indexRactive = new Ractive({
	template: indexTemplate,
	el: 'body',
	data: {
		butts: 'oh for sure'
	}
})
