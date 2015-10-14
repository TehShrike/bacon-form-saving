var extend = require('xtend/mutable')
var makeIgnoreNextObject = require('./ignore-changes')
var Bacon = require('baconjs')

module.exports = function makeCollectingStream(changeStream, initialState, idName, saveFn) {
	var ignoreNext = makeIgnoreNextObject()
	initialState = initialState || {}
	ignoreNext(initialState)

	var upcomingChanges = {}
	var inFlight = false
	var version = initialState.version || 0
	var primaryKey = initialState[idName]

	function sendChangesToServerIfAppropriate(sink) {
		if (Object.keys(upcomingChanges).length > 0 && !inFlight) {
			return sendChangesToServer(sink)
		}
	}

	function sendChangesToServer(sink) {
		var theseChanges = upcomingChanges
		upcomingChanges = {}
		inFlight = true

		theseChanges.version = version
		theseChanges[idName] = primaryKey

		saveFn(theseChanges, function(err, newVersion) {
			inFlight = false
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
			} else if (err) {
				sink(new Bacon.End(err))
			}
		})
	}

	return Bacon.fromBinder(function(sink) {
		return changeStream.onValue(function subscriber(change) {
			var changes = ignoreNext.takeIgnoresIntoAccount(change)

			extend(upcomingChanges, changes)

			sendChangesToServerIfAppropriate(sink)
		})
	})
}
