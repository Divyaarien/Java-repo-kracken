const is = require('@barchart/common-js/lang/is'),
	string = require('@barchart/common-js/lang/string');

const AssetClass = require('./../data/AssetClass');

module.exports = (() => {
	'use strict';

	/**
	 * Static utilities for parsing symbols.
	 *
	 * @public
	 * @ignore
	 */
	class SymbolParser {
		constructor() {

		}

		/**
		 * Returns true when a symbol is not an alias.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsConcrete(symbol) {
			return is.string(symbol) && !this.getIsReference(symbol);
		}

		/**
		 * Returns true when a symbol is an alias.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsReference(symbol) {
			return is.string(symbol) && types.futures.alias.test(symbol);
		}

		/**
		 * Returns true when a symbol represents futures contract.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsFuture(symbol) {
			return is.string(symbol) && (types.futures.concrete.test(symbol) || types.futures.alias.test(symbol));
		}

		/**
		 * Returns true when a symbol represents futures spread.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsFutureSpread(symbol) {
			return is.string(symbol) && types.futures.spread.test(symbol);
		}

		/**
		 * Returns true when a symbol represents an option on a futures contract.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsFutureOption(symbol) {
			return is.string(symbol) && (types.futures.options.short.test(symbol) || types.futures.options.long.test(symbol) || types.futures.options.historical.test(symbol));
		}

		/**
		 * Returns true when a symbol represents a foreign exchange currency pair. However,
		 * this function can return false positives (cyptocurrency symbols can use the same
		 * pattern).
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsForex(symbol) {
			return is.string(symbol) && types.forex.test(symbol);
		}

		/**
		 * Returns true when a symbol represents a cryptocurrency. However, this function can
		 * return false positives (forex symbols can use the same pattern).
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsCrypto(symbol) {
			return is.string(symbol) && types.crypto.test(symbol);
		}

		/**
		 * Returns true if the symbol represents an external index (i.e. an index
		 * which is not generated by Barchart, e.g. the S&P 500).
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsIndex(symbol) {
			return is.string(symbol) && types.indicies.external.test(symbol);
		}

		/**
		 * Returns true if the symbol represents a Barchart sector (i.e. a type
		 * of index calculated by Barchart).
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsSector(symbol) {
			return is.string(symbol) && types.indicies.sector.test(symbol);
		}

		/**
		 * Returns true if the symbol represents a Canadian mutual fund.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsCanadianFund(symbol) {
			return is.string(symbol) && types.funds.canadian.test(symbol);
		}

		/**
		 * Returns true if the symbol represents an instrument which falls under the
		 * cmdty brand.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsCmdty(symbol) {
			return is.string(symbol) && (types.cmdty.stats.test(symbol) || types.cmdty.internal.test(symbol) || types.cmdty.external.test(symbol));
		}

		/**
		 * Returns true if the symbol represents a cmdtyStats instrument.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsCmdtyStats(symbol) {
			return is.string(symbol) && types.cmdty.stats.test(symbol);
		}

		/**
		 * Returns true if the symbol is listed on the BATS exchange.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsBats(symbol) {
			return is.string(symbol) && predicates.bats.test(symbol);
		}

		/**
		 * Returns true if the symbol represents an option on an equity or index; false
		 * otherwise.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsEquityOption(symbol) {
			return is.string(symbol) && types.equities.options.test(symbol);
		}

		/**
		 * Returns true if the symbol has an expiration and the symbol appears
		 * to be expired (e.g. a future for a past year).
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsExpired(symbol) {
			const definition = SymbolParser.parseInstrumentType(symbol);

			let returnVal = false;

			if (definition !== null && definition.year && definition.month) {
				const currentYear = getCurrentYear();

				if (definition.year < currentYear) {
					returnVal = true;
				} else if (definition.year === currentYear && futuresMonthNumbers.hasOwnProperty(definition.month)) {
					const currentMonth = getCurrentMonth();
					const futuresMonth = futuresMonthNumbers[definition.month];

					if (currentMonth > futuresMonth) {
						returnVal = true;
					}
				}
			}

			return returnVal;
		}

		/**
		 * Returns true if the symbol represents a Commodity3 instrument.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsC3(symbol) {
			return is.string(symbol) && (types.c3.concrete.test(symbol) || types.c3.alias.test(symbol));
		}

		/**
		 * Returns true if the symbol represents a Platts instrument.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsPlatts(symbol) {
			return is.string(symbol) && (types.platts.concrete.test(symbol) || types.platts.alias.test(symbol));
		}

		/**
		 * Returns true if the symbol represents a pit-traded instrument. The
		 * name must also be included.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @param {String} name
		 * @returns {Boolean}
		 */
		static getIsPit(symbol, name) {
			return is.string(symbol) && is.string(name) && predicates.pit.test(name);
		}

		/**
		 * Returns true if the symbol represents a grain bid instrument.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static getIsGrainBid(symbol) {
			return is.string(symbol) && types.bids.test(symbol);
		}

		/**
		 * Returns a simple instrument definition containing information which
		 * can be inferred from the symbol. A null value is returned if nothing
		 * can be inferred based solely on the symbol.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Object|null}
		 */
		static parseInstrumentType(symbol) {
			if (!is.string(symbol)) {
				return null;
			}

			let definition = null;

			for (let i = 0; i < parsers.length && definition === null; i++) {
				const parser = parsers[i];

				definition = parser(symbol);
			}

			return definition;
		}

		/**
		 * In some cases, multiple symbols can be used to refer to the same instrument
		 * (e.g. ZCZ1 and ZCZ21 may refer to the same futures contract). That said,
		 * internal quote servers may only recognize one of the symbols. So, given
		 * a symbol, this function will return the symbol which the internal quote
		 * servers will recognize. In other words, the symbol used by the quote "producer"
		 * is returned. In most cases, the same symbol is returned.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {String|null}
		 */
		static getProducerSymbol(symbol) {
			if (!is.string(symbol)) {
				return null;
			}

			let converted = null;

			for (let i = 0; i < converters.length && converted === null; i++) {
				const converter = converters[i];

				converted = converter(symbol);
			}

			return converted;
		}

		/**
		 * Converts a futures option symbol in "database" format to "pipeline" format
		 * (e.g. ZLF320Q -> ZLF9|320C).
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {String|null}
		 */
		static getFuturesOptionPipelineFormat(symbol) {
			const definition = SymbolParser.parseInstrumentType(symbol);

			let formatted = null;

			if (definition.type === 'future_option') {
				const putCallCharacter = getPutCallCharacter(definition.option_type);

				formatted = `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
			}

			return formatted;
		}

		/**
		 * Converts an abbreviated futures symbol (with a single digit year) into
		 * a futures symbol with a two digit year. If the symbol is not a futures
		 * contract, a null value is returned.
		 *
		 * @static
		 * @public
		 * @param {String} symbol
		 * @returns {String|null}
		 */
		static getFuturesExplicitFormat(symbol) {
			let explicit = null;

			if (SymbolParser.getIsFuture(symbol) && SymbolParser.getIsConcrete(symbol)) {
				const parsed = SymbolParser.parseInstrumentType(symbol);

				explicit = `${parsed.root}${parsed.month}${string.padLeft(Math.floor(parsed.year % 100).toString(), 2, '0')}`;
			}

			return explicit;
		}

		/**
		 * Determine (or guess) the expiration year (for a futures contract), given
		 * the string representation of the expiration year and the expiration month
		 * code.
		 *
		 * @static
		 * @public
		 * @param {String} yearString
		 * @param {String} monthCode
		 */
		static getFuturesYear(yearString, monthCode) {
			return getFuturesYear(yearString, monthCode);
		}

		/**
		 * Returns true if prices for the symbol should be represented as a percentage; false
		 * otherwise.
		 *
		 * @public
		 * @static
		 * @param {String} symbol
		 * @returns {Boolean}
		 */
		static displayUsingPercent(symbol) {
			return is.string(symbol) && predicates.percent.test(symbol);
		}

		toString() {
			return '[SymbolParser]';
		}
	}

	const alternateFuturesMonths = {
		A: 'F',
		B: 'G',
		C: 'H',
		D: 'J',
		E: 'K',
		I: 'M',
		L: 'N',
		O: 'Q',
		P: 'U',
		R: 'V',
		S: 'X',
		T: 'Z'
	};

	const futuresMonthNumbers = {
		F: 1,
		G: 2,
		H: 3,
		J: 4,
		K: 5,
		M: 6,
		N: 7,
		Q: 8,
		U: 9,
		V: 10,
		X: 11,
		Z: 12
	};

	const predicates = {};

	predicates.bats = /^(.*)\.BZ$/i;
	predicates.percent = /(\.RT)$/;
	predicates.pit = /\(P(it)?\)/;

	const types = {};

	types.bids = /^([A-Z]{2})([B|P])([A-Z\d]{3,4})-(\d+)-(\d+)(\.CM)$/i;

	types.c3 = {};
	types.c3.alias = /^(C3:)(.*)$/i;
	types.c3.concrete = /(\.C3)$/i;

	types.cmdty = { };
	types.cmdty.stats = /(\.CS)$/i;
	types.cmdty.internal = /(\.CM)$/i;
	types.cmdty.external = /(\.CP)$/i;

	types.crypto = /^\^([A-Z]{3})([A-Z]{3,4})$/i;

	types.equities = {};
	types.equities.options = /^([A-Z\$][A-Z\-]{0,}(\.[A-Z]{1})?)([0-9]?)(\.[A-Z]{2})?\|([[0-9]{4})([[0-9]{2})([[0-9]{2})\|([0-9]+\.[0-9]+)[P|W]?(C|P)/i;

	types.forex = /^\^([A-Z]{3})([A-Z]{3})$/i;

	types.funds = { };
	types.funds.canadian = /(.*)(\.CF)$/i;

	types.futures = {};
	types.futures.alias = /^([A-Z][A-Z0-9\$\-!\.]{0,2})(\*{1})([0-9]{1,2})$/i;
	types.futures.concrete = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z]{1})([0-9]{4}|[0-9]{1,2})$/i;
	types.futures.spread = /^_S_/i;

	types.futures.options = {};
	types.futures.options.historical = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z])([0-9]{2})([0-9]{1,5})(C|P)$/i;
	types.futures.options.long = /^([A-Z][A-Z0-9\$\-!\.]{0,2})([A-Z])([0-9]{1,4})\|(\-?[0-9]{1,5})(C|P)$/i;
	types.futures.options.short = /^([A-Z][A-Z0-9\$\-!\.]?)([A-Z])([0-9]{1,4})([A-Z])$/i;

	types.indicies = {};
	types.indicies.external = /^\$(.*)$/i;
	types.indicies.sector = /^\-(.*)$/i;

	types.platts = { };
	types.platts.alias = /^(PLATTS:)(.*)$/i;
	types.platts.concrete = /^(.*)(\.PT)$/i;

	const parsers = [];

	parsers.push((symbol) => {
		let definition = null;

		if (types.futures.spread.test(symbol)) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'future_spread';
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		const match = symbol.match(types.futures.concrete);

		if (match !== null) {
			definition = {};

			definition.symbol = symbol;

			definition.type = 'future';
			definition.asset = AssetClass.FUTURE;

			definition.dynamic = false;
			definition.root = match[1];
			definition.month = match[2];
			definition.year = getFuturesYear(match[3], match[2]);
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		const match = symbol.match(types.futures.alias);

		if (match !== null) {
			definition = {};

			definition.symbol = symbol;

			definition.type = 'future';
			definition.asset = AssetClass.FUTURE;

			definition.dynamic = true;
			definition.root = match[1];
			definition.dynamicCode = match[3];
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		if (types.forex.test(symbol)) {
			definition = {};

			definition.symbol = symbol;

			definition.type = 'forex';
			definition.asset = AssetClass.FOREX;
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		const match = symbol.match(types.equities.options);

		if (match !== null) {
			const suffix = typeof match[4] !== 'undefined' ? match[4] : '';

			definition = {};

			definition.symbol = symbol;

			definition.type = 'equity_option';
			definition.asset = AssetClass.STOCK_OPTION;

			definition.option_type = match[9] === 'C' ? 'call' : 'put';
			definition.strike = parseFloat(match[8]);

			definition.root = `${match[1]}${suffix}`;
			definition.month = parseInt(match[6]);
			definition.day = parseInt(match[7]);
			definition.year = parseInt(match[5]);

			definition.adjusted = match[3] !== '';
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		if (types.indicies.external.test(symbol)) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'index';
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		if (types.indicies.sector.test(symbol)) {
			definition = {};

			definition.symbol = symbol;
			definition.type = 'sector';
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		const match = symbol.match(types.futures.options.short);

		if (match !== null) {
			definition = {};

			const putCallCharacterCode = match[4].charCodeAt(0);
			const putCharacterCode = 80;
			const callCharacterCode = 67;

			let optionType;
			let optionYearDelta;

			if (putCallCharacterCode < putCharacterCode) {
				optionType = 'call';
				optionYearDelta = putCallCharacterCode - callCharacterCode;
			} else {
				optionType = 'put';
				optionYearDelta = putCallCharacterCode - putCharacterCode;
			}

			definition.symbol = symbol;

			definition.type = 'future_option';
			definition.asset = AssetClass.FUTURE_OPTION;

			definition.option_type = optionType;
			definition.strike = parseInt(match[3]);

			definition.root = match[1];
			definition.month = match[2];
			definition.year = getCurrentYear() + optionYearDelta;
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		const match = symbol.match(types.futures.options.long) || symbol.match(types.futures.options.historical);

		if (match !== null) {
			definition = {};

			definition.symbol = symbol;

			definition.type = 'future_option';
			definition.asset = AssetClass.FUTURE_OPTION;

			definition.option_type = match[5] === 'C' ? 'call' : 'put';
			definition.strike = parseInt(match[4]);

			definition.root = match[1];
			definition.month = getFuturesMonth(match[2]);
			definition.year = getFuturesYear(match[3]);
		}

		return definition;
	});

	parsers.push((symbol) => {
		let definition = null;

		const match = symbol.match(types.cmdty.stats);

		if (match !== null) {
			definition = {};

			definition.symbol = symbol;

			definition.type = 'cmdtyStats';
			definition.asset = AssetClass.CMDTY_STATS;
		}

		return definition;
	});

	const converters = [];

	converters.push((symbol) => {
		let converted = null;

		if (SymbolParser.getIsFuture(symbol) && SymbolParser.getIsConcrete(symbol)) {
			converted = symbol.replace(/(.{1,3})([A-Z]{1})([0-9]{3}|[0-9]{1})?([0-9]{1})$/i, '$1$2$4') || null;
		}

		return converted;
	});

	converters.push((symbol) => {
		let converted = null;

		if (SymbolParser.getIsFutureOption(symbol)) {
			const definition = SymbolParser.parseInstrumentType(symbol);

			const putCallCharacter = getPutCallCharacter(definition.option_type);

			if (definition.root.length < 3) {
				const putCallCharacterCode = putCallCharacter.charCodeAt(0);

				// 2021/01/02, BRI. Per Tom, symbols (for the same instrument) change each year.
				// For calls that expire this year, the letter is "C" ... For calls that expire next
				// year, the letter is "D" ... For calls that expire two years from now, the letter
				// is "E" ... etc ...

				converted = `${definition.root}${definition.month}${definition.strike}${String.fromCharCode(putCallCharacterCode + definition.year - getCurrentYear())}`;
			} else {
				converted = `${definition.root}${definition.month}${getYearDigits(definition.year, 1)}|${definition.strike}${putCallCharacter}`;
			}
		}

		return converted;
	});

	converters.push((symbol) => {
		let converted = null;

		if (types.c3.alias.test(symbol)) {
			converted = symbol.replace(types.c3.alias, '$2.C3');
		}

		return converted;
	});

	converters.push((symbol) => {
		let converted = null;

		if (types.platts.alias.test(symbol)) {
			converted = symbol.replace(types.platts.alias, '$2.PT');
		}

		return converted;
	});

	converters.push((symbol) => {
		return symbol;
	});

	function getCurrentMonth() {
		const now = new Date();

		return now.getMonth() + 1;
	}

	function getCurrentYear() {
		const now = new Date();

		return now.getFullYear();
	}

	function getYearDigits(year, digits) {
		const yearString = year.toString();

		return yearString.substring(yearString.length - digits, yearString.length);
	}

	function getFuturesMonth(monthString) {
		return alternateFuturesMonths[monthString] || monthString;
	}

	function getFuturesYear(yearString, monthCode) {
		const currentYear = getCurrentYear();

		let year = parseInt(yearString);

		if (year === 0 && monthCode === 'Y') {
			year = Math.floor(currentYear / 100) * 100 + 100;
		} else if (year < 10 && yearString.length === 1) {
			const bump = (year < currentYear % 10) ? 1 : 0;

			year = Math.floor(currentYear / 10) * 10 + year + (bump * 10);
		} else if (year < 100) {
			year = Math.floor(currentYear / 100) * 100 + year;

			if (currentYear + 25 < year) {
				year = year - 100;
			}
		}

		return year;
	}

	function getPutCallCharacter(optionType) {
		if (optionType === 'call') {
			return 'C';
		} else if (optionType === 'put') {
			return 'P';
		} else {
			return null;
		}
	}

	return SymbolParser;
})();