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


/**Farble image data, inspired by FPRandom 
 * 
 * https://github.com/plaperdr/fprandom
 * 
 * Important note: as the original implementation is in C++, we cannot use it directly using JShelter,
 * 				   thus we try to implement the algorithm on our own with JS
 */
function farbleCanvasDataFPRandom(imageData, randomMode, range=3, constant=7) {
	console.debug(`Called farbleCanvasDataFPRandom() with randomMode: ${randomMode}`);

	let data = imageData.data;
	let len = data.length;

	let MIN_HEX_CODE = 0;
	let MAX_HEX_CODE = 255;
	let randomR, randomG, randomB;

	function getRandomRGB() {
		randomR = ~~(Math.random() * constant);
		randomG = ~~(Math.random() * constant);
		randomB = ~~(Math.random() * constant);
	}

	function getModifiedColor(color, randomNum) {
		let newColor = color - range + randomNum;
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
function farbleCanvasDataPixelSmoothing(imageData, coefficient) {
	console.debug('Called farbleCanvasDataPixelShuffling()');

	let data = imageData.data;
	let len = data.length;

	if (coefficient > 1) {
		coefficient = coefficient / 100;
	}

	for (let i = 0; i < len; i += 4) {
		// choose the random channel which will inherit the values of neighboring pixel's channel
		const channel = ~~(Math.random() * 3); 

		let leftValue = 0
		let rightValue = 0;
		if (i - 4 >= 0) {
			leftValue = data[i - 4 + channel];
		}
		if (i + 4 < len) {
			rightValue = data[i + 4 + channel];	
		}

		data[i + channel] += coefficient * (rightValue - leftValue);
		// do not care of overflow
	} // end of outer for loop
}

/**Farbles the canvas by randomly selecting pixels which will be modified, in advance
 * 
 * The modification is done by negating rgb channel
 */
function farbleCanvasRandomPixels(imageData, percentage) {
	console.debug('Called farbleCanvasRandomPixels()');

	let data = imageData.data;
	const len = data.length;

	// just to assure
	if (percentage > 1) {
		percentage = percentage / 100;
	}

	// generate random indexes of data to be modified for 20% of the canvas
	const len_pixels_rgba = len / 4;
	let lenDataToModify = ~~(len_pixels_rgba * percentage);

	// generate random indexes of pixels and modify them right at place
	for (let i = 0; i < lenDataToModify; i++) {
		let randomIndex = ~~(Math.random() * len_pixels_rgba) * 4;

		// negate each of the RGB channels
		data[randomIndex] = 255 - data[randomIndex];
		data[randomIndex+1] = 255 - data[randomIndex+1];
		data[randomIndex+2] = 255 - data[randomIndex+2];
	}
}

/**Farble the canvas by mapping fake colours to real colours (RGB's values) */
function farbleCanvasMapping(imageData, threshold, variant=0) {
	console.debug('Called farbleCanvasMapping()');

	let data = imageData.data;
	const len = data.length;

	let colorMap = new Map();

	for (let i = 0; i < len; i += 4) {
		let r = data[i];
		let g = data[i + 1];	
		let b = data[i + 2];
		let colorKey = `${r}-${g}-${b}`;

		if (!colorMap.has(colorKey)) {
			colorMap.set(colorKey, true);
		}
	}


	if (colorMap.size > threshold) {
		if (variant === 1) {
			farbleCanvasDataBrave(imageData, 1);
		} else if (variant === 2) {
			// should be faster than the previous one, with bigger range
			farbleCanvasDataFPRandom(imageData, false, 6, 13);
		} else {
			// iterate over the data and slightly change the colours,
			// but each colour will be mapped to the same fake colour
			for (let [colorKey, _] of colorMap) {
				let [r, g, b] = colorKey.split('-');

				let fakeR = r;
				let fakeG = g;
				let fakeB = b;

				if (Math.random() < 0.5) {
					fakeR ^= 1;
				}
				if (Math.random() < 0.5) {
					fakeG ^= 1;
				}
				if (Math.random() < 0.5) {
					fakeB ^= 1;
				}

				for (let i = 0; i < len; i += 4) {
					if (data[i] == r && data[i + 1] == g && data[i + 2] == b) {
						data[i] = fakeR;
						data[i + 1] = fakeG;
						data[i + 2] = fakeB;
					}
				}
			}
		}
	}
}