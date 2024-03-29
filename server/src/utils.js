'use strict';

const logger = require('./logger');

const MIN_VERSION = [ 2, 3, 0 ];

// Recursive version compare, could be flatter but opted for instant return if
//  comparison is greater rather than continuing to compare to end.
const version_compare = (actual, minimum) => {
  for (let i = 0; i < minimum.length; ++i) {
    if (actual[i] > minimum[i]) {
      return true;
    } else if (actual[i] < minimum[i]) {
      return false;
    }
  }
  return true;
};

// Check that RethinkDB matches version requirements
const rethinkdb_version_check = (version_string) => {
  const rethinkdb_version_regex = /^rethinkdb (\d+)\.(\d+)\.(\d+)/i;
  const matches = rethinkdb_version_regex.exec(version_string);

  if (matches) {
    // Convert strings to ints and remove first match
    const versions = matches.slice(1).map((val) => parseInt(val));

    if (!version_compare(versions, MIN_VERSION)) {
      throw new Error(`RethinkDB (${versions.join('.')}) is below required version ` +
                      `(${MIN_VERSION.join('.')}) for use with Horizon.`);
    }
  } else {
    throw new Error(`Unable to determine RethinkDB version, check ` +
                    `RethinkDB is >= ${MIN_VERSION.join('.')}.`);
  }
};

module.exports = {
  rethinkdb_version_check,
};
