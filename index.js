const _ = require("lodash");
//mixin all the methods into Lodash object
require("deepdash")(_);

const fs = require('fs');

const button = require("./button.json");
let buttonLocalized = require("./button.json");
const translations = require('./translations/Button-pt.json');

let objectsL10n = [];

const convert = (aPath) =>
  Array.from(aPath).map((value, index) => {
    let lastItem = index === aPath.length - 1;
    if (lastItem) {
      return _.camelCase(value.replace("muiL10n", ""));
    }

    return value;
  });

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
      omit,
      apply,
      stringValue: value,
      stringLocalized: localize(key, value)
    });    
  }
});

objectsL10n.forEach(objectL10n => {
  _.set(buttonLocalized, objectL10n.apply, objectL10n.stringLocalized);
  _.set(buttonLocalized, objectL10n.omit, undefined);
});

fs.writeFile('Button.localized.json', JSON.stringify(buttonLocalized, undefined, true), (err) => {
  if (err) return console.log(err);  
});

console.log(objectsL10n);
