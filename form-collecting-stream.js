var extend = require('xtend/mutable')
var makeIgnoreNextObject = require('./ignore-changes')
var Bacon = require('baconjs')
var EventEmitter = require('events').EventEmitter

module.exports = function makeCollectingStream(changeStream, initialState, idName, saveFn) {
	var ignoreNext = makeIgnoreNextObject()
	initialState = initialState || {}
	ignoreNext(initialState)

	var upcomingChanges = {}
	var inFlight = null
	var version = initialState.version || 0
	var primaryKey = initialState[idName]
	var savedEmitter = new EventEmitter()

	function sendChangesToServerIfAppropriate(sink) {
		if (Object.keys(upcomingChanges).length > 0 && !inFlight) {
			return sendChangesToServer(sink)
		}
	}

	function sendChangesToServer(sink) {
		var theseChanges = upcomingChanges
		upcomingChanges = {}
		inFlight = Object.keys(theseChanges)

		theseChanges.version = version
		theseChanges[idName] = primaryKey

		saveFn(theseChanges, function(err, newVersion) {
			var notInFlightAnyMore = inFlight
			inFlight = null

			if (err) {
				sink(new Bacon.Error(err))
				upcomingChanges = {}
			}

			if (!err || err.outOfDate) {
				ignoreNext(newVersion)
				sink(newVersion)
				version = newVersion.version
				primaryKey = newVersion[idName]
				sendChangesToServerIfAppropriate(sink)
				savedEmitter.emit('properties', notInFlightAnyMore)


			} else if (err) {
				sink(new Bacon.End(err))
			}
		})
	}

	var newVersionsFromServer = Bacon.fromBinder(function(sink) {
		return changeStream.onValue(function subscriber(change) {
			var changes = ignoreNext.takeIgnoresIntoAccount(change)

			extend(upcomingChanges, changes)

			sendChangesToServerIfAppropriate(sink)
		})
	})

	var propertiesSavedAndGotBackFromServer = Bacon.fromEvent(savedEmitter, 'properties')

	return {
		newVersionsFromServer: newVersionsFromServer,
		propertiesSavedAndGotBackFromServer: propertiesSavedAndGotBackFromServer
	}
}
