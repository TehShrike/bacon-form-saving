var extend = require('xtend/mutable')
var combine = require('combine-arrays')

module.exports = function makeIgnoreNextObject() {
	var ignoreNext = {}

	function takeIgnoresIntoAccount(object) {
		var keys = Object.keys(object)

		var values = keys.map(function(key) {
			return object[key]
		})

		var outputCopy = combine({
			key: keys,
			value: values
		}).filter(function(pair) {
			return ignoreNext[pair.key] !== pair.value
		}).reduce(function(outputCopy, pair) {
			outputCopy[pair.key] = pair.value
			return outputCopy
		}, {})

		keys.forEach(function(key) {
			delete ignoreNext[key]
		})

		return outputCopy
	}

	function ignoreFn(objectWithPropertiesAndValuesToIgnore) {
		extend(ignoreNext, objectWithPropertiesAndValuesToIgnore)
	}

	ignoreFn.takeIgnoresIntoAccount = takeIgnoresIntoAccount

	return ignoreFn
}
