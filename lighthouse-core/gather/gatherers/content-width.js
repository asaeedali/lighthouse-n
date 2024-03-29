/**
 * @license
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const Gatherer = require('./gatherer');

/* global window */

/* istanbul ignore next */
function getContentWidth() {
  // window.innerWidth to get the scrollable size of the window (irrespective of zoom)
  // window.outerWidth to get the size of the visible area
  return Promise.resolve({
    scrollWidth: window.innerWidth,
    viewportWidth: window.outerWidth
  });
}

class ContentWidth extends Gatherer {

  afterPass(options) {
    const driver = options.driver;

    return driver.evaluateAsync(`(${getContentWidth.toString()}())`)

    .then(returnedValue => {
      if (!Number.isFinite(returnedValue.scrollWidth) ||
          !Number.isFinite(returnedValue.viewportWidth)) {
        throw new Error(`ContentWidth results were not numeric: ${JSON.stringify(returnedValue)}`);
      }

      this.artifact = returnedValue;
    }, _ => {
      this.artifact = {
        scrollWidth: -1,
        viewportWidth: -1
      };
      return;
    });
  }
}

module.exports = ContentWidth;
