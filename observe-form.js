var Bacon = require('baconjs')
var makeObservable = require('./ractive-stream')

module.exports = function observeForm(ractive, properties, keypath) {
	return Bacon.mergeAll(properties.map(function(key) {
		return makeObservable(ractive, keypathJoin(keypath, key), key)
	}))
	return Bacon.mergeAll([
		makeObservable(indexRactive, 'theThing.thing1', 'thing1'),
		makeObservable(indexRactive, 'theThing.thing2', 'thing2'),
		makeObservable(indexRactive, 'theThing.thing3', 'thing3'),
		makeObservable(indexRactive, 'theThing.thing4', 'thing4'),
		makeObservable(indexRactive, 'theThing.thing5', 'thing5')
	])
}

function keypathJoin(keypath, key) {
	return keypath ? (keypath + '.' + key) : key
}
