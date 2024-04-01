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
	var thiscanvas_prng = alea(Date.now());

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
}

/**Farble image data, inspired by PriVaricator's adding 5% noise
 * 
 * as the PriVaricator's implementation is not available, we implement it on our own
 * and name it as method A
 */
function farbleCanvasDataBravePriVaricatorA(rowIterator, width) {
	// here the session hash should be seeded, but for simulating the behavior of reopening the browser, we use Date.now()
	const thiscanvas_prng = alea(Date.now());

	const data_count = width * 4;

	for (row of rowIterator()) {
		// iterate through pixels, not each channel of each pixel
		for (let i = 0; i < data_count; i += 4) {
			if (thiscanvas_prng() <= 0.05) { // Modify data with probability of 0.05
				// choose either of the channels by newly generated random number
				// [0, 1, 2] for RGB, A is not modified
				const i_rgb = Math.floor(thiscanvas_prng() * 3);

				row[i + i_rgb] ^= 1;
			}
		}
	}
}