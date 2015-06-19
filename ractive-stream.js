var Bacon = require('baconjs')

module.exports = function makeObservable(ractive, keypath, property) {
	return Bacon.fromBinder(function(sink) {
		ractive.observe(keypath, sink)
		ractive.on('teardown', function() {
			sink(new Bacon.End())
		})
	}).map(function(str) {
		var o = {}
		o[property] = str
		return o
	})
}
