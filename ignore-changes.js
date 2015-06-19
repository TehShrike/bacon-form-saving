var extend = require('extend')

module.exports = function makeIgnoreNextObject() {
	var ignoreNext = {}

	function takeIgnoresIntoAccount(object) {
		var outputCopy = {}

		Object.keys(object).forEach(function(key) {
			if (ignoreNext[key] !== object[key]) {
				outputCopy[key] = object[key]
			}
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
