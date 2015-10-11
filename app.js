var fs = require('fs')
var Ractive = require('ractive')
var makeCollectingStream = require('./form-collecting-stream')
var observeForm = require('./observe-form')

var initialObject = {
	thing1: 'initial value',
	thing2: 'lol'
}

var indexRactive = new Ractive({
	template: fs.readFileSync('./main.html').toString(),
	el: 'body',
	data: {
		theThing: initialObject
	}
})
var fields = ['thing1', 'thing2', 'thing3', 'thing4', 'thing5']
var changedFieldsStream = observeForm(indexRactive, fields, 'theThing')

makeCollectingStream(changedFieldsStream, initialObject, serverApi).onValue(function(changeReportedByServer) {
	indexRactive.set(prependKeysWith('theThing.', changeReportedByServer))

	var savingKeys = prependKeysWith('saving.theThing.', changeReportedByServer)

	Object.keys(savingKeys).forEach(function(key) {
		savingKeys[key] = false
	})

	indexRactive.set(savingKeys)
})

changedFieldsStream.onValue(function(changes) {
	var o = prependKeysWith('saving.theThing.', changes)

	indexRactive.set(o)
})

function serverApi(changes, cb) {
	setTimeout(function() {
		var newData = {}
		Object.keys(changes).forEach(function(key) {
			newData[key] = changes[key] + '!'
		})
		cb(null, newData)
	}, 2000)
}

function prependKeysWith(str, o) {
	return Object.keys(o).reduce(function(memo, key) {
		memo[str + key] = o[key]
		return memo
	}, {})
}
