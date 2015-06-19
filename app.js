var indexTemplate = require('./main.ract').template
var Ractive = require('ractive')
var Bacon = require('baconjs')
var mannish = require('mannish')
var makeCollectingStream = require('./form-collecting-stream')

var appContext = mannish()

var initialObject = {
	thing1: 'initial value',
	thing2: 'lol'
}

var indexRactive = new Ractive({
	template: indexTemplate,
	el: 'body',
	data: {
		theThing: initialObject
	}
})

function makeObservable(ractive, keypath, property) {
	return Bacon.fromBinder(function(sink) {
		ractive.observe(keypath, sink)
		ractive.on('teardown', function() {
			sink(new Bacon.End())
		})
	}).filter(function(str) {
		return !!str
	}).map(function(str) {
		var o = {}
		o[property] = str
		return o
	})
}

appContext('outside').subscribe('save', function(changes, cb) {
	console.log('server got', changes)
	setTimeout(function() {
		var newData = {}
		Object.keys(changes).forEach(function(key) {
			newData[key] = changes[key] + '!'
		})
		cb(null, newData)
	}, 3000)
})

var formObservable = Bacon.mergeAll([
	makeObservable(indexRactive, 'theThing.thing1', 'thing1'),
	makeObservable(indexRactive, 'theThing.thing2', 'thing2'),
	makeObservable(indexRactive, 'theThing.thing3', 'thing3'),
	makeObservable(indexRactive, 'theThing.thing4', 'thing4'),
	makeObservable(indexRactive, 'theThing.thing5', 'thing5')
])

var changeStream = makeCollectingStream(formObservable, appContext, initialObject)

changeStream.subscribe(function(event) {
	var changeReportedByServer = event.value()

	Object.keys(changeReportedByServer).forEach(function(key) {
		indexRactive.set('theThing.' + key, changeReportedByServer[key])
	})
})
