const _ = require("lodash");
//mixin all the methods into Lodash object
require("deepdash")(_);

const fs = require("fs");

const button = require("./button.json");
const buttonLocalized = require("./button.json");
const translations = require("./translations/Button-pt.json");

let objectsL10n = [];

const convert = (aPath) =>
  Array.from(aPath).slice(0, Array.from(aPath).length - 1)


const localize = (key, fallBack) => {
  let localized = translations[key];
  if (!localized) return fallBack;
  return localized;
};

_.eachDeep(button, (value, key, _parentValue, context) => {
  if (_.startsWith(key, "muiL10n")) {
    let omit = context._item.path;
    let apply = convert(omit);
    let key = _.camelCase(apply.join(" "));
    objectsL10n.push({
      key,
      apply,
      omit,      
      stringValue: value,
      stringLocalized: localize(key, value),
    });
  }
});

objectsL10n.forEach((objectL10n) => {
  _.set(buttonLocalized, objectL10n.omit, undefined);
  _.set(buttonLocalized, objectL10n.apply, objectL10n.stringLocalized);
});

fs.writeFile(
  "Button.localized.json",
  JSON.stringify(buttonLocalized, null, '\t'),
  (err) => {
    if (err) return console.log(err);
  }
);

console.log(objectsL10n);
