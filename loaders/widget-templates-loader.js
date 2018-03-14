var loaderUtils = require("loader-utils");

module.exports = function loader(source) {
    var options = loaderUtils.getOptions(this) || {};
    var text = source;

    let templates_obj = "oblio.templates = {\n";
    let imports = Object.keys(options.json).map(function (key) {
        let templatePath = options.json[key].templatePath;
        if (templatePath) {
            let name = templatePath.split('/').pop().split('.html')[0];
            templates_obj += "    " + key + ": " + key + ",\n";
            // return "import { " + name + " } from '" + templatePath + "';";
            return "var " + key + " = require('" + templatePath + "');";
        }
    }).filter(function (path) {
        return path !== undefined;
    }).join("\n");
    templates_obj += "}";

    text = text.replace('/* imports */', imports).replace('/* templates */', templates_obj);

    return text;
};