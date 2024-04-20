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
	console.debug('Called farbleCanvasDataBrave()');

	let crc = new CRC16();

	for (row of rowIterator()) {
		crc.next(row);
	}

	var thiscanvas_prng = alea(domainHash, "CanvasFarbling", crc.crc);

	var data_count = width * 4;

	for (row of rowIterator()) {
		for (let i = 0; i < data_count; i++) {
			if ((i % 4) === 3) {
				continue;
			}
			if (thiscanvas_prng.get_bits(1)) {
				row[i] ^= 1;
			}
		} // end of inner for loop
	} // end of outer for loop
}

/**Farble image data, inspired by PriVaricator's adding 5% noise
 * 
 * as the PriVaricator's implementation is not available, we implement it on our own
 * and name it as method A
 */
function farbleCanvasDataPriVaricatorA(rowIterator, width) {
	console.debug('Called farbleCanvasDataPriVaricatorA()');

	let crc = new CRC16();

	for (row of rowIterator()) {
		crc.next(row);
	}

	var thiscanvas_prng = alea(domainHash, "CanvasFarbling", crc.crc);

	var data_count = width * 4;

	for (row of rowIterator()) {
		for (let i = 0; i < data_count; i += 4) {
			if (thiscanvas_prng() <= 0.05) {
				// choose either of the channels by newly generated random number
				// [0, 1, 2] for RGB, A is not modified
				const i_rgb = ~~(thiscanvas_prng() * 3);

				row[i + i_rgb] ^= 1;
			}
		} // end of for loop
	}
}

/**Farble image data, inspired by PriVaricator's adding 5% noise
 * 
 * as the PriVaricator's implementation is not available, we implement it on our own
 * and name it as method B, which compared to method A, modifies alpha channel too (with 1/4 probability)
 */
function farbleCanvasDataPriVaricatorB(rowIterator, width) {
	console.debug('Called farbleCanvasDataPriVaricatorB()');

	let crc = new CRC16();

	for (row of rowIterator()) {
		crc.next(row);
	}

	var thiscanvas_prng = alea(domainHash, "CanvasFarbling", crc.crc);

	var data_count = width * 4;

	for (row of rowIterator()) {
		for (let i = 0; i < data_count; i += 4) {
			if (thiscanvas_prng() <= 0.05) {
				// choose either of the channels by newly generated random number
				// [0, 1, 2, 3] for RGBA
				const i_rgb = ~~(thiscanvas_prng() * 4);

				row[i + i_rgb] ^= 1;
			}
		}
	} // end of for loop
}

/**Farble image data, inspired by FPRandom 
 * 
 * https://github.com/plaperdr/fprandom
 * 
 * Important note: as the original implementation is in C++, we cannot use it directly using JShelter,
 * 				   thus we try to implement the algorithm on our own with JS
 */
function farbleCanvasDataFPRandom(rowIterator, width, randomMode) {
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
		randomR = ~~(thiscanvas_prng() * 7);
		randomG = ~~(thiscanvas_prng() * 7);
		randomB = ~~(thiscanvas_prng() * 7);
	}

	function getModifiedColor(color, randomNum) {
		let newColor = color - 3 + randomNum;
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

	console.debug('getRandomRGB executed ' + counter + ' times.');
}

/**Shuffles the pixel data on the canvas
 * 
 * Uses Math.random() to choose the RGB channel of pixel
 * Then the channel will inherit the neighboring pixels' cahnnel values by following formula:
 * pixel[Math.random() * 3] += 0.05 * (rightValue - leftValue)
 * 
 * This method applies for every pixel on the canvas
 */
function farbleCanvasDataPixelShuffling(rowIterator, width) {
	let crc = new CRC16();

	for (row of rowIterator()) {
		crc.next(row);
	}

	var thiscanvas_prng = alea(domainHash, "CanvasFarbling", crc.crc);

	var data_count = width * 4;

	for (row of rowIterator()) {
		for (let i = 0; i < data_count; i += 4) {
			// choose the random channel which will inherit the values of neighboring pixel's channel
			const channel = ~~(thiscanvas_prng() * 3); 

			let leftValue = 0, rightValue = 0;
			if (i - 4 + channel < 0) {
				leftValue = row[i - 4 + channel];
			}
			if (i + 4 + channel <= data_count) {
				rightValue = row[i + 4 + channel];	
			}

			row[i + channel] += 0.05 * (rightValue - leftValue);

			// ensure it's 8-byte
			if (row[i + channel] < 0) {
				row[i + channel] = 0;
			} else if (row[i + channel] > 255) {
				row[i + channel] = 255;
			}
		}
	} // end of outer for loop
}

/**Farbles the canvas by randomly selecting pixels which will be modified, in advance
 * 
 * The modification is done by bitwise XOR with 1
 */
function farbleCanvasRandomPixels(rowIterator, width) {
	console.debug('Called farbleCanvasRandomPixels()');

	let crc = new CRC16();

	// obtain the count of pixels of the whole canvas
	let len_pixels_rgba = 0;
	for (row of rowIterator()) {
		crc.next(row);
		len_pixels_rgba += row.length / 4;
	}

	var thiscanvas_prng = alea(domainHash, "CanvasFarbling", crc.crc);

	var data_count = width * 4;


	// generate random indexes of data to be modified for 20% of the canvas
	let lenDataToModify = ~~(len_pixels_rgba * (0.1 + thiscanvas_prng() * 0.1));
	
	let channelToModify = -1;

	if (lenDataToModify === 0) {
		channelToModify = ~~(thiscanvas_prng() * 4); // one of the RGBA channels of a single pixel
	}

	// generate random indexes of pixels and modify them right at place
	for (let row of rowIterator()) {
		if (lenDataToModify === 0) {
			row[channelToModify] ^= 1;
			lenDataToModify = -1;
			continue;
		} else if (lenDataToModify === -1) {
			break;
		}

		let pixelsToModifyIndexes = [];

		for (let i = 0; i < lenDataToModify; i++) {
			let randomIndex = ~~(thiscanvas_prng() * row.length / 4);

			// check if the index is already in the array
			// guaranteeing that at least 0.15 of the canvas will be modified
			// O(n^2) in worst case scenario
			if (pixelsToModifyIndexes.includes(randomIndex)) {
				i--;
				continue;
			}

			pixelsToModifyIndexes.push(randomIndex);
			lenDataToModify--;

			const channel = ~~(thiscanvas_prng() * 4);
			// modify the selected pixel
			row[(randomIndex * 4) + channel] ^= 1;
		}
	}
}