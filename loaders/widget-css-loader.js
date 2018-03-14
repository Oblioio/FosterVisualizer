var loaderUtils = require("loader-utils");

module.exports = function loader(source) {
	var options = loaderUtils.getOptions(this) || {};
	var text = source;

	// replace "/* sections */" in main.js file with lines to import sections from en.json 
	if (source.match(/\/\*\simports\s\*\//)) {
		
		let keys = Object.keys(options.json);

		let importsTxt = keys.filter(function (key) {
			return typeof options.json[key].cssPath !== 'undefined';
		}).reduce(function (acc, key) {
			acc += "@import \"" + options.json[key].cssPath + "\";\n";
			return acc;
		}, "");

		// console.log('WIDGET-CSS-LOADER', importsTxt);
		text = source.replace(/\/\*\simports\s\*\//, importsTxt);
	}

	// const transformed = css.replace('/* imports */', '.classNameB')

	// return transformed

	return text;
};