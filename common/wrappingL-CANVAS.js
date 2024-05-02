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
function farbleCanvasDataBrave(imageData, number) {
	console.debug('Called farbleCanvasDataBrave()');

	let data = imageData.data;
    let len = data.length;

	for (let i = 0; i < len; i++) {
		// if alpha, do not modify
		if (i % 4 === 3) {
			continue;
		}

		if (Math.random() < 0.5) {
            data[i] ^= number;
        }
	} // end of for loop
}

/**Farble image data, inspired by PriVaricator's adding 5% noise
 * 
 * as the PriVaricator's implementation is not available, we implement it on our own
 * and name it as method A
 */
function farbleCanvasDataPriVaricatorA(imageData) {
	console.debug('Called farbleCanvasDataPriVaricatorA()');

	let data = imageData.data;
	let len = data.length;

	for (let i = 0; i < len; i += 4) {
		if (Math.random() <= 0.05) {
			// choose either of the channels by newly generated random number
			// [0, 1, 2] for RGB, A is not modified
			const i_rgb = ~~(Math.random() * 3);

			data[i + i_rgb] ^= 1;
		}
	} // end of for loop
}

/**Farble image data, inspired by PriVaricator's adding 5% noise
 * 
 * as the PriVaricator's implementation is not available, we implement it on our own
 * and name it as method B, which compared to method A, modifies alpha channel too (with 1/4 probability)
 */
function farbleCanvasDataPriVaricatorB(imageData) {
	console.debug('Called farbleCanvasDataPriVaricatorB()');

	let data = imageData.data;
	let len = data.length;

	for (let i = 0; i < len; i += 4) {
		if (Math.random() <= 0.05) {
			// choose either of the channels by newly generated random number
			// [0, 1, 2, 3] for RGBA
			const i_rgb = ~~(Math.random() * 4);

			data[i + i_rgb] ^= 1;
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
function farbleCanvasDataFPRandom(imageData, randomMode) {
	console.debug(`Called farbleCanvasDataFPRandom() with randomMode: ${randomMode}`);

	let data = imageData.data;
	let len = data.length;

	let MIN_HEX_CODE = 0;
	let MAX_HEX_CODE = 255;
	let randomR, randomG, randomB;

	function getRandomRGB() {
		randomR = ~~(Math.random() * 7);
		randomG = ~~(Math.random() * 7);
		randomB = ~~(Math.random() * 7);
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

	for (let i = 0; i < len; i += 4) {
		data[i] = getModifiedColor(data[i], randomR); // R
		data[i + 1] = getModifiedColor(data[i + 1], randomG); // G
		data[i + 2] = getModifiedColor(data[i + 2], randomB); // B

		if (randomMode) {
			// in FPRandom, if random mode is selected, it is supposed to reinitialize values each iteration 	
			getRandomRGB();
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
function farbleCanvasDataPixelShuffling(imageData) {
	console.debug('Called farbleCanvasDataPixelShuffling()');

	let data = imageData.data;
	let len = data.length;

	for (let i = 0; i < len; i += 4) {
		// choose the random channel which will inherit the values of neighboring pixel's channel
		const channel = ~~(Math.random() * 3); 

		let leftValue = 0, rightValue = 0;
		if (i - 4 + channel < 0) {
			leftValue = data[i - 4 + channel];
		}
		if (i + 4 + channel <= len) {
			rightValue = data[i + 4 + channel];	
		}

		data[i + channel] += 0.05 * (rightValue - leftValue);

		// ensure it's 8-byte
		if (data[i + channel] < 0) {
			data[i + channel] = 0;
		} else if (data[i + channel] > 255) {
			data[i + channel] = 255;
		}
	} // end of outer for loop
}

/**Farbles the canvas by randomly selecting pixels which will be modified, in advance
 * 
 * The modification is done by bitwise XOR with 1
 */
function farbleCanvasRandomPixels(imageData) {
	console.debug('Called farbleCanvasRandomPixels()');

	let data = imageData.data;
	const len = data.length;

	// generate random indexes of data to be modified for 20% of the canvas
	const len_pixels_rgba = len / 4;
	let lenDataToModify = ~~(len_pixels_rgba * (0.1 + Math.random() * 0.1));

	if (lenDataToModify === 0) {
		const channelToModify  = ~~(Math.random() * 4); // one of the RGBA channels of a single pixel
		data[channelToModify] ^= 1;
		return;
	}

	let pixelsToModifyIndexes = [];

	// generate random indexes of pixels and modify them right at place
	for (let i = 0; i < lenDataToModify; i++) {
		let randomIndex = ~~(Math.random() * len_pixels_rgba);

		// check if the index is already in the array
		// guaranteeing that at least 0.15 of the canvas will be modified
		// O(n^2) in worst case scenario
		if (pixelsToModifyIndexes.includes(randomIndex)) {
			i--;
			continue;
		}

		pixelsToModifyIndexes.push(randomIndex);

		const channel = ~~(Math.random() * 4);
		// modify the selected pixel
		data[(randomIndex * 4) + channel] ^= 1;
	}
}