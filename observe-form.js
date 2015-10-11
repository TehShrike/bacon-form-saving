var Bacon = require('baconjs')
var makeObservable = require('./ractive-stream')

module.exports = function observeForm(ractive, properties, keypath) {
	return Bacon.mergeAll(properties.map(function(key) {
		return makeObservable(ractive, keypathJoin(keypath, key), key)
	}))
}

function keypathJoin(keypath, key) {
	return keypath ? (keypath + '.' + key) : key
}
