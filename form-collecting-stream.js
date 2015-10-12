var extend = require('xtend/mutable')
var makeIgnoreNextObject = require('./ignore-changes')
var Bacon = require('baconjs')

module.exports = function makeCollectingStream(changeStream, initialState, saveFn) {
	var ignoreNext = makeIgnoreNextObject()

	ignoreNext(initialState)

	var upcomingChanges = {}
	var inFlight = false

	function sendChangesToServerIfAppropriate(sink) {
		if (Object.keys(upcomingChanges).length > 0 && !inFlight) {
			return sendChangesToServer(sink)
		}
	}

	function sendChangesToServer(sink) {
		var theseChanges = upcomingChanges
		upcomingChanges = {}
		inFlight = true

		saveFn(theseChanges, function(err, changes) {
			inFlight = false
			if (err) {
				sink(new Bacon.Error(err))
				upcomingChanges = {}
			} else {
				ignoreNext(changes)
				sink(changes)
				sendChangesToServerIfAppropriate(sink)
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
