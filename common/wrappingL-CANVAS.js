/** \file
 * \brief Library of functions for the Canvas API wrappers
 *
 * \see https://www.w3.org/TR/generic-sensor/
 *
 *  \author Copyright (C) 2022  Libor Polčák
 *  \author Copyright (C) 2021  Matus Svancar
 *
 *  \license SPDX-License-Identifier: GPL-3.0-or-later
 */
 //
 //  This program is free software: you can redistribute it and/or modify
 //  it under the terms of the GNU General Public License as published by
 //  the Free Software Foundation, either version 3 of the License, or
 //  (at your option) any later version.
 //
 //  This program is distributed in the hope that it will be useful,
 //  but WITHOUT ANY WARRANTY; without even the implied warranty of
 //  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 //  GNU General Public License for more details.
 //
 //  You should have received a copy of the GNU General Public License
 //  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 //
 /** \file
  * \ingroup wrappers
  *
  * Supporting fuctions for Canvas API Wrappers
  */

/**
 * Farble image data, original Brave implementation-like
 *
 * \param data RGBA shallow array, (0,0) coordinates are at the top left,
 * see CanvasRenderingContext2D.prototype.getImageData for more details on the
 * expected format. Note that the data are modified during the call.
 * \param height Height of the original canvas.
 * \param width Width of the original canvas.
 */
function farbleCanvasDataBrave(rowIterator, width) {
	// PRNG function needs to depend on the original canvas, so that the same
	// image is farbled the same way but different images are farbled differently
	// See https://pagure.io/JShelter/webextension/issue/23
	console.debug(); /* Intentionally one the same line */let start_time = Date.now();
	let crc = new CRC16();
	console.debug("Timing farbleCanvasDataBrave CRC init", Date.now() - start_time);
	for (row of rowIterator()) {
		crc.next(row);
	}
	console.debug("Timing farbleCanvasDataBrave CRC computed", Date.now() - start_time);
	var thiscanvas_prng = alea(domainHash, "CanvasFarbling", crc.crc);
	console.debug("Timing farbleCanvasDataBrave PRNG init", Date.now() - start_time);
	var data_count = width * 4;

	for (row of rowIterator()) {
		for (let i = 0; i < data_count; i++) {
			if ((i % 4) === 3) {
				// Do not modify alpha
				continue;
			}
			if (thiscanvas_prng.get_bits(1)) { // Modify data with probability of 0.5
				// Possible improvements:
				// Copy a neighbor pixel (possibly with modifications
				// Make bigger canges than xoring with 1
				row[i] ^= 1;
			}
		}
	}
	console.debug("Timing farbleCanvasDataBrave Farbled", Date.now() - start_time);
}

/**Farble image data, inspired by FPRandom 
 * 
 * https://github.com/plaperdr/fprandom
 * 
 * Important note: as the original implementation is in C++, we cannot use it directly using JShelter,
 * 				   thus we try to implement the algorithm on our own with JS
 */
function farbleCanvasDataFPRandom(rowIterator, width, randomMode, c1=3, c2=7) {
	console.debug(`Called farbleCanvasDataFPRandom() with randomMode: ${randomMode}`);

	let crc = new CRC16();

	for (row of rowIterator()) {
		crc.next(row);
	}

	var thiscanvas_prng = alea(domainHash, "CanvasFarbling", crc.crc);

	var data_count = width * 4;

	let MIN_HEX_CODE = 0;
	let MAX_HEX_CODE = 255;
	let randomR, randomG, randomB;

	function getRandomRGB() {
		randomR = ~~(thiscanvas_prng() * c2);
		randomG = ~~(thiscanvas_prng() * c2);
		randomB = ~~(thiscanvas_prng() * c2);
	}

	function getModifiedColor(color, randomNum) {
		let newColor = color - c1 + randomNum;
		if (MIN_HEX_CODE > newColor) {
			newColor = 0;
		}
		if (newColor > MAX_HEX_CODE) {
			newColor = 255;
		}

		return newColor;
	}

	getRandomRGB(); // initialize random RGB values

	for (row of rowIterator()) {
		for (let i = 0; i < data_count; i += 4) {
			row[i] = getModifiedColor(row[i], randomR); // R
			row[i + 1] = getModifiedColor(row[i + 1], randomG); // G
			row[i + 2] = getModifiedColor(row[i + 2], randomB); // B

			if (randomMode) {
				// in FPRandom, if random mode is selected, it is supposed to reinitialize values each iteration 	
				getRandomRGB();
			}
		}
	} // end of for loop
}