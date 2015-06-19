var indexTemplate = require('./main.ract').template
var Ractive = require('ractive')
var Bacon = require('baconjs')
var mannish = require('mannish')
var makeCollectingStream = require('./form-collecting-stream')
var observeForm = require('./observe-form')

var appContext = mannish()

var initialObject = {
	thing1: 'initial value',
	thing2: 'lol'
}

var mediatorSaveKey = 'saveIt'

var indexRactive = new Ractive({
	template: indexTemplate,
	el: 'body',
	data: {
		theThing: initialObject
	}
})

var formObservable = observeForm(indexRactive, ['thing1', 'thing2', 'thing3', 'thing4', 'thing5'], 'theThing')

appContext('outside').subscribe(mediatorSaveKey, function(changes, cb) {
	console.log('server got', changes)
	setTimeout(function() {
		var newData = {}
		Object.keys(changes).forEach(function(key) {
			newData[key] = changes[key] + '!'
		})
		cb(null, newData)
	}, 3000)
})

var changeStream = makeCollectingStream({
	observable: formObservable,
	mediatorKey: mediatorSaveKey,
	appContext: appContext,
	initialState: initialObject
})

changeStream.subscribe(function(event) {
	var changeReportedByServer = event.value()

	Object.keys(changeReportedByServer).forEach(function(key) {
		indexRactive.set('theThing.' + key, changeReportedByServer[key])
	})
})
