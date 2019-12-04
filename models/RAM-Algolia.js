'use strict'

const	algoliasearch = require('algoliasearch'),
		firebase = require('./RAM-connection'),
		id = "",
		key = "",
		index = "RAM",
		algolia = algoliasearch(id,key),
		AlgoliaSH = index,
		search = {algoliasearch,algolia,AlgoliaSH}

module.exports = search