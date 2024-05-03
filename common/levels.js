/** \file
 * \brief Operations and data structures connected to protection levels
 *
 *  \author Copyright (C) 2019-2021  Libor Polcak
 *  \author Copyright (C) 2019  Martin Timko
 *  \author Copyright (C) 2021  Matus Svancar
 *	\author Copyright (C) 2022  Marek Salon
 *  \author Copyright (C) 2022  Martin Bednar
 *  \author Copyright (C) 2023  Martin Zmitko
 *
 *  \license SPDX-License-Identifier: GPL-3.0-or-later
 */
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

/**
 * Wrapping groups
 *
 * Used to control the built-in levels and GUI (e.g. level tweaks).
 */
var wrapping_groups = {
	empty_level: { /// Automatically populated
		level_text: "",
		level_id: "",
		level_description: "",
	},
	group_map: {}, ///Automatically populated
	wrapper_map: {}, ///Automatically populated
	group_names: [], ///Automatically populated
	get_wrappers: function(level) {
		wrappers = [];
		for (group of wrapping_groups.groups) {
			if ((level[group.id] !== undefined) && level[group.id] !== 0) {
				let arg_values = group.params[level[group.id] - 1].config;
				group.wrappers.forEach((w) => wrappers.push([w, ...arg_values]));
			}
		}
		return wrappers;
	},
	groups: [
		{
			name: "time_precision",
			label: browser.i18n.getMessage("jssgroupTimePrecision"),
			description: browser.i18n.getMessage("jssgroupTimePrecision"),
			description2: [browser.i18n.getMessage("jssgroupTimePrecisionDescription2", browser.i18n.getMessage("jssgroupPhysicalLocationGeolocation"))],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupPoor"),
					description: browser.i18n.getMessage("jssgroupTimePoorDescription"),
					config: [2, false],
				},
				{
					short: browser.i18n.getMessage("jssgroupLow"),
					description: browser.i18n.getMessage("jssgroupTimeLowDescription"),
					config: [1, false],
				},
				{
					short: browser.i18n.getMessage("jssgroupHigh"),
					description: browser.i18n.getMessage("jssgroupTimeHighDescription"),
					config: [0, true],
				},
			],
			wrappers: [
				// HRT
				"Performance.prototype.now",
				// PT2
				"PerformanceEntry.prototype",
				// ECMA
				"window.Date",
				// DOM
				"Event.prototype.timeStamp",
				// GP
				"Gamepad.prototype.timestamp",
				// VR
				"VRFrameData.prototype.timestamp",
        // SENSOR
        "Sensor.prototype.timestamp",
			],
		},
		{
			name: "htmlcanvaselement",
			label: browser.i18n.getMessage("jssgroupLocallyRenderedImages"),
			description: browser.i18n.getMessage("jssgroupLocallyRenderedImagesDescription"),
			description2: [
				browser.i18n.getMessage("jssgroupCanvasLocallyRenderedImagesDescription2"),
				browser.i18n.getMessage("jssgroupCanvasLocallyRenderedImagesDescription3")
			],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupLittleLies"),
					description: browser.i18n.getMessage("jssgroupLocallyRenderedImagesLittleLiesDescription"),
					config: [0],
				},
				{
					short: browser.i18n.getMessage("jssgroupStrict"),
					description: browser.i18n.getMessage("jssgroupLocallyRenderedImagesStrictDescription"),
					config: [1],
				},
				{
					short: "5% noise",
					description: "Use PriVaricator's method to protect against Canvas fingerprinting. The noise is added by selecting random pixels and XORing the RGB channels with themselves.",
					config: [2],
				},
				{
					short: "10% noise",
					description: "Use PriVaricator's method to protect against Canvas fingerprinting. But 10 % noise is added to canvas by XORing the RGB channels with themselves.",
					config: [3],
				},
				{
					short: "FPRandom off",
					description: "FPRandom's method to protect against Canvas fingerprinting. RandomMode is off",
					config: [4],
				},
				{
					short: "FPRandom on",
					description: "FPRandom's method to protect against Canvas fingerprinting, RandomMode is on",
					config: [5],
				},
				{
					short: "Smoothing 10%",
					description: "Use smoothing's method to protect against Canvas fingerprinting. But 10 % of the randomly selected channel's from neighboring pixels are added to the current pixel.",
					config: [6],
				},
				{
					short: "Noise of randomly selected pixels",
					description: "15% of noise is added to canvas by XOR with 1 of randomly selected RGBA channels of random pixels",
					config: [7],
				},
				{
					short: "Brave - 2 bits",
					description: "Same implementation as in JShelter, but instead of 1 bit, modify 2 bits with 50 % chance of modification",
					config: [8],
				},
				{
					short: "Brave - 3 bits",
					description: "Same implementation as in JShelter, but instead of 1 bit, modify 3 bits with 50 % chance of modification",
					config: [9],
				},
				{
					short: "Brave - 4 bits",
					description: "Same implementation as in JShelter, but instead of 1 bit, modify 4 bits with 50 % chance of modification",
					config: [10],
				},
				{
					short: "Brave - 5 bits",
					description: "Same implementation as in JShelter, but instead of 1 bit, modify 5 bits with 50 % chance of modification",
					config: [11],
				},
				{
					short: "Brave - 6 bits",
					description: "Same implementation as in JShelter, but instead of 1 bit, modify 6 bits with 50 % chance of modification",
					config: [12],
				},
				{
					short: "Brave - 7 bits",
					description: "Same implementation as in JShelter, but instead of 1 bit, modify 7 bits with 50 % chance of modification",
					config: [13],
				},				
				{
					short: "15% noise",
					description: "Use PriVaricator's method to protect against Canvas fingerprinting. But 15 % noise is added to canvas by XORing the RGB channels with themselves.",
					config: [14],
				},
				{
					short: "20% noise",
					description: "Use PriVaricator's method to protect against Canvas fingerprinting. But 20 % noise is added to canvas by XORing the RGB channels with themselves.",
					config: [15],
				},
				{
					short: "% noise",
					description: "Use PriVaricator's method to protect against Canvas fingerprinting. But 25 % noise is added to canvas by XORing the RGB channels with themselves.",
					config: [16],
				},				
				{
					short: "75% noise",
					description: "Use PriVaricator's method to protect against Canvas fingerprinting. But 50 % noise is added to canvas by XORing the RGB channels with themselves.",
					config: [17],
				},
				{
					short: "Smoothing 20%",
					description: "Use smoothing's method to protect against Canvas fingerprinting. But 20 % of the randomly selected channel's from neighboring pixels are added to the current pixel.",
					config: [18],
				},
				{
					short: "Smoothing 30%",
					description: "Use smoothing's method to protect against Canvas fingerprinting. But 30 % of the randomly selected channel's from neighboring pixels are added to the current pixel.",
					config: [19],
				},
				{
					short: "Smoothing 50%",
					description: "Use smoothing's method to protect against Canvas fingerprinting. But 50 % of the randomly selected channel's from neighboring pixels are added to the current pixel.",
					config: [20],
				},
				{
					short: "Mapping threshold 1 - irelevant",
					description: "Iterates over image data and if the image contains more than 1 different pixels (different in RGB values), than apply the mapping, thus each pixel will have a different color. Threshold 1 is irelevant but I won't delete this from the implementation.",
					config: [21],
				},
				{
					short: "Mapping threshold 2",
					description: "Iterates over image data and if the image contains more than 2 different pixels (different in RGB values), than apply the mapping, thus each pixel will have a different color.",
					config: [22],
				},
				{
					short: "Mapping threshold 3",
					description: "Iterates over image data and if the image contains more than 3 different pixels (different in RGB values), than apply the mapping, thus each pixel will have a different color.",
					config: [23],
				},
				{
					short: "Mapping threshold 4",
					description: "Iterates over image data and if the image contains more than 4 different pixels (different in RGB values), than apply the mapping, thus each pixel will have a different color.",
					config: [24],
				},
				{
					short: "Mapping threshold 5",
					description: "Iterates over image data and if the image contains more than 5 different pixels (different in RGB values), than apply the mapping, thus each pixel will have a different color.",
					config: [25],
				},
				{
					short: "Mapping threshold 10",
					description: "Iterates over image data and if the image contains more than 10 different pixels (different in RGB values), than apply the mapping, thus each pixel will have a different color.",
					config: [26],
				},
				{
					short: "Mapping threshold 50",
					description: "Iterates over image data and if the image contains more than 50 different pixels (different in RGB values), than apply the mapping, thus each pixel will have a different color.",
					config: [27],
				},
				{
					short: "Mapping threshold 100",
					description: "Iterates over image data and if the image contains more than 100 different pixels (different in RGB values), than apply the mapping, thus each pixel will have a different color.",
					config: [28],
				},
				{
					short: "Mapping threshold 1000",
					description: "Iterates over image data and if the image contains more than 1000 different pixels (different in RGB values), than apply the mapping, thus each pixel will have a different color.",
					config: [29],
				},
				{
					short: "Mapping threshold 10000",
					description: "Iterates over image data and if the image contains more than 10000 different pixels (different in RGB values), than apply the mapping, thus each pixel will have a different color.",
					config: [30],
				},
				{
					short: "Mapping threshold 100000",
					description: "Iterates over image data and if the image contains more than 100000 different pixels (different in RGB values), than apply the mapping, thus each pixel will have a different color.",
					config: [31],
				},
				{
					short: "Mapping threshold 1000000",
					description: "Iterates over image data and if the image contains more than 1000000 different pixels (different in RGB values), than apply the mapping, thus each pixel will have a different color.",
					config: [32],
				},
				{
					short: "Mapping threshold 10000000",
					description: "Iterates over image data and if the image contains more than 10000000 different pixels (different in RGB values), than apply the mapping, thus each pixel will have a different color.",
					config: [33],
				},
			],
			wrappers: [
				// H-C
				"CanvasRenderingContext2D.prototype.getImageData",
				"HTMLCanvasElement.prototype.toBlob",
				"HTMLCanvasElement.prototype.toDataURL",
				"OffscreenCanvas.prototype.convertToBlob",
				"CanvasRenderingContext2D.prototype.isPointInStroke",
				"CanvasRenderingContext2D.prototype.isPointInPath",
				"WebGLRenderingContext.prototype.readPixels",
				"WebGL2RenderingContext.prototype.readPixels",
			],
		},
		{
			name: "audiobuffer",
			label: browser.i18n.getMessage("jssgroupLocallyGeneratedAudio"),
			description: browser.i18n.getMessage("jssgroupLocallyGeneratedAudioDescription"),
			description2: [
				browser.i18n.getMessage("jssgroupLocallyGeneratedAudioDescription2"),
			],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupLittleLies"),
					description: browser.i18n.getMessage("jssgroupLocallyGeneratedAudioLittleLiesDescription"),
					config: [0],
				},
				{
					short: browser.i18n.getMessage("jssgroupStrict"),
					description: browser.i18n.getMessage("jssgroupLocallyGeneratedAudioStrictDescription"),
					config: [1],
				},
			],
			wrappers: [
				// AUDIO
				"AudioBuffer.prototype.getChannelData",
				"AudioBuffer.prototype.copyFromChannel",
				"AnalyserNode.prototype.getByteTimeDomainData",
				"AnalyserNode.prototype.getFloatTimeDomainData",
				"AnalyserNode.prototype.getByteFrequencyData",
				"AnalyserNode.prototype.getFloatFrequencyData"
			],
		},
		{
			name: "webgl",
			label: browser.i18n.getMessage("jssgroupGraphicCardInformation"),
			description: browser.i18n.getMessage("jssgroupGraphicCardInformationDescription"),
			description2: [
				browser.i18n.getMessage("jssgroupGraphicCardInformationDescription2"),
				browser.i18n.getMessage("jssgroupGraphicCardInformationDescription3"),
		],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupLittleLies"),
					description: browser.i18n.getMessage("jssgroupGraphicCardInformationLittleLiesDescription"),
					config: [0],
				},
				{
					short: browser.i18n.getMessage("jssgroupStrict"),
					description: browser.i18n.getMessage("jssgroupGraphicCardInformationStrictDescription"),
					config: [1],
				},
			],
			wrappers: [
				// WEBGL
				"WebGLRenderingContext.prototype.getParameter",
				"WebGL2RenderingContext.prototype.getParameter",
				"WebGLRenderingContext.prototype.getFramebufferAttachmentParameter",
				"WebGL2RenderingContext.prototype.getFramebufferAttachmentParameter",
				"WebGLRenderingContext.prototype.getActiveAttrib",
				"WebGL2RenderingContext.prototype.getActiveAttrib",
				"WebGLRenderingContext.prototype.getActiveUniform",
				"WebGL2RenderingContext.prototype.getActiveUniform",
				"WebGLRenderingContext.prototype.getAttribLocation",
				"WebGL2RenderingContext.prototype.getAttribLocation",
				"WebGLRenderingContext.prototype.getBufferParameter",
				"WebGL2RenderingContext.prototype.getBufferParameter",
				"WebGLRenderingContext.prototype.getProgramParameter",
				"WebGL2RenderingContext.prototype.getProgramParameter",
				"WebGLRenderingContext.prototype.getRenderbufferParameter",
				"WebGL2RenderingContext.prototype.getRenderbufferParameter",
				"WebGLRenderingContext.prototype.getShaderParameter",
				"WebGL2RenderingContext.prototype.getShaderParameter",
				"WebGLRenderingContext.prototype.getShaderPrecisionFormat",
				"WebGL2RenderingContext.prototype.getShaderPrecisionFormat",
				"WebGLRenderingContext.prototype.getTexParameter",
				"WebGL2RenderingContext.prototype.getTexParameter",
				"WebGLRenderingContext.prototype.getUniformLocation",
				"WebGL2RenderingContext.prototype.getUniformLocation",
				"WebGLRenderingContext.prototype.getVertexAttribOffset",
				"WebGL2RenderingContext.prototype.getVertexAttribOffset",
				"WebGLRenderingContext.prototype.getSupportedExtensions",
				"WebGL2RenderingContext.prototype.getSupportedExtensions",
				"WebGLRenderingContext.prototype.getExtension",
				"WebGL2RenderingContext.prototype.getExtension",
			],
		},
		{
			name: "plugins",
			label: browser.i18n.getMessage("jssgroupInstalledBrowserPlugins"),
			description: browser.i18n.getMessage("jssgroupInstalledBrowserPluginsDescription"),
			description2: [browser.i18n.getMessage("jssgroupInstalledBrowserPluginsDescription2")],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupLittleLies"),
					description: browser.i18n.getMessage("jssgroupInstalledBrowserPluginsLittleLiesDescription"),
					config: [0],
				},
				{
					short: browser.i18n.getMessage("jssgroupFake"),
					description: browser.i18n.getMessage("jssgroupInstalledBrowserPluginsFakeDescription"),
					config: [1],
				},
				{
					short: browser.i18n.getMessage("jssgroupStrict"),
					description: browser.i18n.getMessage("jssgroupInstalledBrowserPluginsStrictDescription"),
					config: [2],
				},
			],
			wrappers: [
				// NP
				"Navigator.prototype.plugins", // also modifies "Navigator.prototype.mimeTypes",
			],
		},
		{
			name: "enumerateDevices",
			label: browser.i18n.getMessage("jssgroupConnectedCamerasAndMicrophones"),
			description: browser.i18n.getMessage("jssgroupConnectedCamerasAndMicrophonesDescription"),
			description2: [
				browser.i18n.getMessage("jssgroupConnectedCamerasAndMicrophonesDescription2"),
		],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupLittleLies"),
					description: browser.i18n.getMessage("jssgroupConnectedCamerasAndMicrophonesLittleLiesDescription"),
					config: [0],
				},
				{
					short: browser.i18n.getMessage("jssgroupAddFake"),
					description: browser.i18n.getMessage("jssgroupConnectedCamerasAndMicrophonesAddFakeDescription"),
					config: [1],
				},
				{
					short: browser.i18n.getMessage("jssgroupStrict"),
					description: browser.i18n.getMessage("jssgroupConnectedCamerasAndMicrophonesStrictDescription"),
					config: [2],
				},
			],
			wrappers: [
				// MCS
				"MediaDevices.prototype.enumerateDevices",
			],
		},
		{
			name: "hardware",
			label: browser.i18n.getMessage("jssgroupHardware"),
			description: browser.i18n.getMessage("jssgroupHardwareDescription"),
			description2: [
				browser.i18n.getMessage("jssgroupHardwareDescription2"),
			],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupLow"),
					description: browser.i18n.getMessage("jssgroupHardwareLowDescription"),
					config: [0],
				},
				{
					short: browser.i18n.getMessage("jssgroupMedium"),
					description: browser.i18n.getMessage("jssgroupHardwareMediumDescription"),
					config: [1],
				},
				{
					short: browser.i18n.getMessage("jssgroupHigh"),
					description: browser.i18n.getMessage("jssgroupHardwareHighDescription"),
					config: [2],
				},
			],
			wrappers: [
				// HTML-LS
				"Navigator.prototype.hardwareConcurrency",
				// DM
				"Navigator.prototype.deviceMemory",
			],
		},
		{
			name: "net",
			label: browser.i18n.getMessage("jssgroupNetworkConditions"),
			description: browser.i18n.getMessage("jssgroupNetworkConditionsDescription"),
			description2: [],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupRemove"),
					description: browser.i18n.getMessage("jssgroupNetworkConditionsRemoveDescription"),
					config: [0],
				},
			],
			wrappers: [
				// NET
				"Navigator.prototype.connection",
				"window.NetworkInformation",
			],
		},
		{
			name: "xhr",
			label: browser.i18n.getMessage("jssgroupXMLHttpRequestRequests"),
			description: browser.i18n.getMessage("jssgroupXMLHttpRequestRequestsDescription"),
			description2: [browser.i18n.getMessage("jssgroupXMLHttpRequestRequestsDescription2")],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupAsk"),
					description: browser.i18n.getMessage("jssgroupXMLHttpRequestRequestsAskDescription"),
					config: [false, true],
				},
				{
					short: browser.i18n.getMessage("jssgroupBlock"),
					description: browser.i18n.getMessage("jssgroupXMLHttpRequestRequestsBlockDescription"),
					config: [true, false],
				},
			],
			wrappers: [
				// AJAX
				"XMLHttpRequest.prototype.open",
				"XMLHttpRequest.prototype.send",
			],
		},
		{
			name: "arrays",
			label: browser.i18n.getMessage("jssgroupArrays"),
			description: browser.i18n.getMessage("jssgroupArraysDescription"),
			description2: [],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupArraysShift"),
					description: browser.i18n.getMessage("jssgroupArraysShiftDescription"),
					config: [false],
				},
				{
					short: browser.i18n.getMessage("jssgroupArraysRandomize"),
					description: browser.i18n.getMessage("jssgroupArraysRandomizeDescription"),
					config: [true],
				},
			],
			wrappers: [
				"window.DataView",
				"window.Uint8Array",
				"window.Int8Array",
				"window.Uint8ClampedArray",
				"window.Int16Array",
				"window.Uint16Array",
				"window.Int32Array",
				"window.Uint32Array",
				"window.Float32Array",
				"window.Float64Array",
				'window.BigInt64Array',
				'window.BigUint64Array',
			],
		},
		{
			name: "shared_array",
			label: browser.i18n.getMessage("jssgroupSharedArraysBuffer"),
			description: browser.i18n.getMessage("jssgroupSharedArraysBufferDescription"),
			description2: [],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupMedium"),
					description: browser.i18n.getMessage("jssgroupSharedArraysBufferMediumDescription"),
					config: [false],
				},
				{
					short: browser.i18n.getMessage("jssgroupStrict"),
					description: browser.i18n.getMessage("jssgroupSharedArraysBufferStrictDescription"),
					config: [true],
				},
			],
			wrappers: [
				// SHARED
				"window.SharedArrayBuffer"
			],
		},
		{
			name: "webworker",
			label: browser.i18n.getMessage("jssgroupWebWorker"),
			description: browser.i18n.getMessage("jssgroupWebWorkerDescription"),
			description2: [browser.i18n.getMessage("jssgroupWebWorkerDescription2")],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupLow"),
					description: browser.i18n.getMessage("jssgroupWebWorkerLowDescription"),
					config: [false, false],
				},
				{
					short: browser.i18n.getMessage("jssgroupStrict"),
					description: browser.i18n.getMessage("jssgroupWebWorkerStrictDescription"),
					config: [true, false],
				},
				{
					short: browser.i18n.getMessage("jssgroupRemove"),
					description: browser.i18n.getMessage("jssgroupWebWorkerRemoveDescription"),
					config: [false, true],
				},
			],
			wrappers: [
				"window.Worker",
			],
		},
		{
			name: "geolocation",
			label: browser.i18n.getMessage("jssgroupPhysicalLocationGeolocation"),
			description: browser.i18n.getMessage("jssgroupPhysicalLocationGeolocationDescription"),
			description2: [browser.i18n.getMessage("jssgroupPhysicalLocationGeolocationDescription2")],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupGeolocationTimestampOnly"),
					description: browser.i18n.getMessage("jssgroupGeolocationTimestampOnlyDescription", browser.i18n.getMessage("jssgroupTimePrecision")),
					config: [-1],
				},
				{
					short: browser.i18n.getMessage("jssgroupGeolocationVillage"),
					description: browser.i18n.getMessage("jssgroupGeolocationVillageDescription"),
					config: [2],
				},
				{
					short: browser.i18n.getMessage("jssgroupGeolocationTown"),
					description: browser.i18n.getMessage("jssgroupGeolocationTownDescription"),
					config: [3],
				},
				{
					short: browser.i18n.getMessage("jssgroupGeolocationRegion"),
					description: browser.i18n.getMessage("jssgroupGeolocationRegionDescription"),
					config: [4],
				},
				{
					short: browser.i18n.getMessage("jssgroupGeolocationLongDistance"),
					description: browser.i18n.getMessage("jssgroupGeolocationLongDistanceDescription"),
					config: [5],
				},
				{
					short: browser.i18n.getMessage("jssgroupRemove"),
					description: browser.i18n.getMessage("jssgroupGeolocationRemoveDescription"),
					config: [0],
				},
			],
			wrappers: [
				// GPS
				"Navigator.prototype.geolocation",
				"window.Geolocation",
				"window.GeolocationCoordinates",
				"window.GeolocationPosition",
				"window.GeolocationPositionError",
				"Geolocation.prototype.getCurrentPosition",
				"Geolocation.prototype.watchPosition",
				"Geolocation.prototype.clearWatch"
			],
		},
    {
			name: "physical_environment",
			label: browser.i18n.getMessage("jssgroupPhysicalEnvironmentSensors"),
			description: browser.i18n.getMessage("jssgroupPhysicalEnvironmentSensorsDescription"),
			description2: [browser.i18n.getMessage("jssgroupPhysicalEnvironmentSensorsDescription2")],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupHigh"),
					description: browser.i18n.getMessage("jssgroupPhysicalEnvironmentSensorsHighDescription"),
					config: [true],
				},
			],
			wrappers: [
        // GENERIC SENSOR API Sensors

				// Magnetometer
				"Magnetometer.prototype.x",
        "Magnetometer.prototype.y",
        "Magnetometer.prototype.z",

        // Accelerometer, LinearAccelerationSensor, and GravitySensor
        "Accelerometer.prototype.x",
        "Accelerometer.prototype.y",
        "Accelerometer.prototype.z",

        // Gyroscope
        "Gyroscope.prototype.x",
        "Gyroscope.prototype.y",
        "Gyroscope.prototype.z",

        // AbsoluteOrientationSensor and RelativeOrientationSensor
        "OrientationSensor.prototype.quaternion",

        // AmbientLightSensor
        "AmbientLightSensor.prototype.illuminance"
			],
		},
		{
			name: "useridle",
			label: browser.i18n.getMessage("jssgroupUserIdleDetection"),
			description: browser.i18n.getMessage("jssgroupUserIdleDetectionDescription"),
			description2: [browser.i18n.getMessage("jssgroupUserIdleDetectionDescription2")],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupConfuse"),
					description: browser.i18n.getMessage("jssgroupConfuseDescription"),
					config: [0],
				},
				{
					short: browser.i18n.getMessage("jssgroupBlock"),
					description: browser.i18n.getMessage("jssgroupBlockDescription"),
					config: [1],
				},
				{
					short: browser.i18n.getMessage("jssgroupRemove"),
					description: browser.i18n.getMessage("jssgroupRemoveDescription"),
					config: [2],
				},
			],
			wrappers: [
				// COOP-SCHEDULING
				"window.IdleDetector",
				"IdleDetector.requestPermission",
				"IdleDetector.prototype.screenState",
				"IdleDetector.prototype.userState",
			],
		},
		{
			name: "coopschedule",
			label: browser.i18n.getMessage("jssgroupCoopschedule"),
			description: browser.i18n.getMessage("jssgroupCoopscheduleDescription"),
			description2: [browser.i18n.getMessage("jssgroupCoopscheduleDescription2")],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupConfuse"),
					description: browser.i18n.getMessage("jssgroupCoopscheduleConfuseDescription"),
					config: [],
				},
			],
			wrappers: [
				// COOP-SCHEDULING
				"IdleDeadline.prototype.didTimeout",
				"IdleDeadline.prototype.timeRemaining",
			],
		},
		{
			name: "gamepads",
			label: browser.i18n.getMessage("jssgroupGamepads"),
			description: browser.i18n.getMessage("jssgroupGamepadsDescription"),
			description2: [],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupStrict"),
					description: browser.i18n.getMessage("jssgroupGamepadsStrictDescription"),
					config: [true],
				},
			],
			wrappers: [
				// GAMEPAD
				"Navigator.prototype.getGamepads",
			],
		},
		{
			name: "vr",
			label: browser.i18n.getMessage("jssgroupVirtualAndAugmentedRealityDevices"),
			description: browser.i18n.getMessage("jssgroupVirtualAndAugmentedRealityDevicesDescription"),
			description2: [browser.i18n.getMessage("jssgroupVirtualAndAugmentedRealityDevicesDescription2")],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupStrict"),
					description: browser.i18n.getMessage("jssgroupVirtualAndAugmentedRealityDevicesStrictDescription"),
					config: [],
				},
			],
			wrappers: [
				// VR
				"Navigator.prototype.activeVRDisplays",
				// XR
				"Navigator.prototype.xr",
			],
		},
		{
			name: "playback",
			label: browser.i18n.getMessage("jssgroupMultimediaPlayback"),
			description: browser.i18n.getMessage("jssgroupMultimediaPlaybackDescription"),
			description2: [browser.i18n.getMessage("jssgroupMultimediaPlaybackDescription2")],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupLittleLies"),
					description: browser.i18n.getMessage("jssgroupMultimediaPlaybackLittleLiesDescription"),
					config: [0],
				},
				{
					short: browser.i18n.getMessage("jssgroupStrict"),
					description: browser.i18n.getMessage("jssgroupMultimediaPlaybackStrictDescription"),
					config: [1],
				},
				{
					short: browser.i18n.getMessage("jssgroupBlock"),
					description: browser.i18n.getMessage("jssgroupMultimediaPlaybackBlockDescription"),
					config: [2],
				},
			],
			wrappers: [
				// EME
				"Navigator.prototype.requestMediaKeySystemAccess",
				// MEDIA-CAPABILITIES
				"MediaCapabilities.prototype.encodingInfo",
				"MediaCapabilities.prototype.decodingInfo",
				// HTML5
				"HTMLMediaElement.prototype.canPlayType",
			],
		},
		{
			name: "analytics",
			label: browser.i18n.getMessage("jssgroupUnreliableTransfersToServerBeacons"),
			description: browser.i18n.getMessage("jssgroupUnreliableTransfersToServerBeaconsDescription"),
			description2: [browser.i18n.getMessage("jssgroupUnreliableTransfersToServerBeaconsDescription2"), browser.i18n.getMessage("jssgroupUnreliableTransfersToServerBeaconsDescription3")],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupBlock"),
					description: browser.i18n.getMessage("jssgroupUnreliableTransfersToServerBeaconsBlockDescription"),
					config: [],
				},
			],
			wrappers: [
				// BEACON
				"Navigator.prototype.sendBeacon",
			],
		},
		{
			name: "battery",
			label: browser.i18n.getMessage("jssgroupHardwareBattery"),
			description: browser.i18n.getMessage("jssgroupHardwareBatteryDescription"),
			description2: [],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupRemove"),
					description: browser.i18n.getMessage("jssgroupHardwareBatteryRemoveDescription"),
					config: [],
				},
			],
			wrappers: [
				// BATTERY
				"Navigator.prototype.getBattery",
				"window.BatteryManager",
			],
		},
		{
			name: "windowname",
			label: browser.i18n.getMessage("jssgroupPersistentIdentifierOfTheBrowserTab"),
			description: browser.i18n.getMessage("jssgroupPersistentIdentifierOfTheBrowserTabDescription"),
			description2: [browser.i18n.getMessage("jssgroupPersistentIdentifierOfTheBrowserTabDescription2")],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupStrict"),
					description: browser.i18n.getMessage("jssgroupPersistentIdentifierOfTheBrowserTabStrictDescription"),
					config: [],
				},
			],
			wrappers: [
				// WINDOW-NAME
				"window.name",
			],
		},
		{
			name: "nfc",
			label: browser.i18n.getMessage("jssgroupNFC"),
			description: browser.i18n.getMessage("jssgroupNFCDescription"),
			description2: [browser.i18n.getMessage("jssgroupNFCDescription2")],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupRemove"),
					description: browser.i18n.getMessage("jssgroupNFCRemoveDescription"),
					config: [],
				},
			],
			wrappers: [
				// BATTERY
				"window.NDEFMessage",
				"window.NDEFReader",
				"window.NDEFRecord",
			],
		},
		{
			name: "wasm",
			label: browser.i18n.getMessage("jssgroupWASM"),
			description: browser.i18n.getMessage("jssgroupWASMDescription"),
			description2: [
				browser.i18n.getMessage("jssgroupWASMDescription2", [browser.i18n.getMessage("jssgroupLocallyRenderedImages"), browser.i18n.getMessage("jssgroupLocallyGeneratedAudio"), browser.i18n.getMessage("jssgroupLittleLies")]),
				browser.i18n.getMessage("jssgroupWASMDescription3"),
			],
			params: [
				{
					short: browser.i18n.getMessage("jssgroupWASMDisabled"),
					description: browser.i18n.getMessage("jssgroupWASMDisabledDescription"),
					config: [0],
				},
				{
					short: browser.i18n.getMessage("jssgroupWASMPassive"),
					description: browser.i18n.getMessage("jssgroupWASMPassiveDescription"),
					config: [1],
				},
				{
					short: browser.i18n.getMessage("jssgroupWASMActive"),
					description: browser.i18n.getMessage("jssgroupWASMActiveDescription"),
					description2: [
						"jssgroupWASMActiveDescription2","jssgroupWASMActiveDescription3","jssgroupWASMActiveDescription4"
					],
					config: [2],
				},
			],
			wrappers: [], // Special case with no wrappers, this group is for modifying htmlcanvaselement, webgl and audiobuffer farbling behaviour
		},
	],
}
var modify_wrapping_groups = modify_wrapping_groups || (() => null); // Give other scripts the possibility to modify the wrapping_groups objects
modify_wrapping_groups();

/**
 * Check if the given API is supported by the browser
 * @param String to the object which presence to check.
 */
function is_api_undefined(api) {
	let s = api.split(".");
	let last = window;
	for (p of s) {
		try {
			if (last[p] === undefined) {
				return true;
			}
		}
		catch (e) {
			// We may have encountered something like
			// TypeError: 'get startTime' called on an object that does not implement interface PerformanceEntry.
			break;
		}
		last = last[p];
	}
	return false;
}

/**
 * Returns true if all given API wrappers are unsuported.
 */
function are_all_api_unsupported(wrappers) {
	for (wrapper of wrappers) {
		if (!is_api_undefined(wrapper)) {
			return false;
		}
	}
	return true;
}

/// Automatically populate infered metadata in wrapping_groups.
wrapping_groups.groups.forEach(function (group) {
	group.id = group.name;
	if (!are_all_api_unsupported(group.wrappers) || group.wrappers.length === 0) {
		wrapping_groups.group_names.push(group.name);
		wrapping_groups.empty_level[group.id] = 0;
	}
	wrapping_groups.group_map[group.id] = group
	for (wrapper_name of group.wrappers) {
		wrapping_groups.wrapper_map[wrapper_name] = group.name;
	}
});

// *****************************************************************************
// levels of protection

// Level aliases
const L0 = "0";
const L1 = "1";
const L2 = "2";
const L3 = "3";
const L_EXPERIMENTAL = "Experiment"; // Use a long ID so that it is not in conflict with pre0.7 user-defined levels

// levels for canvas fingerprinting protection
const L_CANVAS_DEFAULT = "CanvasDefault";
const L_CANVAS_PRIVARICATOR_5 = "CanvasMethod5";
const L_CANVAS_PRIVARICATOR_10 = "CanvasMethod10";
const L_CANVAS_FPRANDOM_OFF = "CanvasFPRandomOff";
const L_CANVAS_FPRANDOM_ON = "CanvasFPRandomOn"
const L_CANVAS_PIXEL_SMOOTH = "CanvasPixelSmooth"; // 10
const L_CANVAS_PIXEL_SMOOTH20 = "CanvasPixelSmooth20";
const L_CANVAS_PIXEL_SMOOTH30 = "CanvasPixelSmooth30";
const L_CANVAS_PIXEL_SMOOTH50 = "CanvasPixelSmooth50";
const L_CANVAS_NOISE = "CanvasNoise";
const L_CANVAS_DEFAULT_2BITS = "CanvasDefault2Bits";
const L_CANVAS_DEFAULT_3BITS = "CanvasDefault3Bits";
const L_CANVAS_DEFAULT_4BITS = "CanvasDefault4Bits";
const L_CANVAS_DEFAULT_5BITS = "CanvasDefault5Bits";
const L_CANVAS_DEFAULT_6BITS = "CanvasDefault6Bits";
const L_CANVAS_DEFAULT_7BITS = "CanvasDefault7Bits";
const L_CANVAS_PRIVARICATOR_15 = "CanvasMethod15";
const L_CANVAS_PRIVARICATOR_20 = "CanvasMethod20";
const L_CANVAS_PRIVARICATOR_25 = "CanvasMethod25";
const L_CANVAS_PRIVARICATOR_50 = "CanvasMethod50";
const L_CANVAS_MAPPING_1 = "CanvasMapping1";
const L_CANVAS_MAPPING_2 = "CanvasMapping2";
const L_CANVAS_MAPPING_3 = "CanvasMapping3";
const L_CANVAS_MAPPING_4 = "CanvasMapping4";
const L_CANVAS_MAPPING_5 = "CanvasMapping5";
const L_CANVAS_MAPPING_10 = "CanvasMapping10";
const L_CANVAS_MAPPING_50 = "CanvasMapping50";
const L_CANVAS_MAPPING_100 = "CanvasMapping100";
const L_CANVAS_MAPPING_1000 = "CanvasMapping1000";
const L_CANVAS_MAPPING_10000 = "CanvasMapping10000";
const L_CANVAS_MAPPING_100000 = "CanvasMapping100000";
const L_CANVAS_MAPPING_1000000 = "CanvasMapping1000000";
const L_CANVAS_MAPPING_10000000 = "CanvasMapping10000000";

/// Built-in levels
var level_0 = {
	"builtin": true,
	"level_id": L0,
	"level_text": browser.i18n.getMessage("JSSL0Name"),
	"level_description": browser.i18n.getMessage("JSSL0Description"),
};

var level_1 = {
	"builtin": true,
	"level_id": L1,
	"level_text": browser.i18n.getMessage("JSSL1Name"),
	"level_description": browser.i18n.getMessage("JSSL1Description"),
	"time_precision": 3,
	"net": 1,
	"webworker": 3,
	"geolocation": 3,
  "physical_environment": 1,
	"useridle": 1,
	"coopschedule": 1,
	"gamepads": 1,
	"vr": 1,
	"analytics": 1,
	"battery": 1,
	"nfc": 1,
};

var level_2 = {
	"builtin": true,
	"level_id": L2,
	"level_text": browser.i18n.getMessage("JSSL2Name"),
	"level_description": browser.i18n.getMessage("JSSL2Description"),
	"time_precision": 3,
	"htmlcanvaselement": 1,
	"audiobuffer": 1,
	"webgl": 1,
	"plugins": 2,
	"enumerateDevices": 2,
	"hardware": 1,
	"net": 1,
	"webworker": 3,
	"geolocation": 3,
  "physical_environment": 1,
	"useridle": 2,
	"coopschedule": 1,
	"gamepads": 1,
	"vr": 1,
	"analytics": 1,
	"battery": 1,
	"windowname": 1,
	"nfc": 1,
	"wasm": 1,
};

var level_3 = {
	"builtin": true,
	"level_id": L3,
	"level_text": browser.i18n.getMessage("JSSL3Name"),
	"level_description": browser.i18n.getMessage("JSSL3Description"),
	"time_precision": 3,
	"htmlcanvaselement": 2,
	"audiobuffer": 2,
	"webgl": 2,
	"plugins": 3,
	"enumerateDevices": 3,
	"hardware": 3,
	"net": 1,
	"webworker": 3,
	"geolocation": 6,
  "physical_environment": 1,
	"useridle": 3,
	"coopschedule": 1,
	"gamepads": 1,
	"vr": 1,
	"playback": 2,
	"analytics": 1,
	"battery": 1,
	"windowname": 1,
	"nfc": 1,
};

var level_experimental = {
	"builtin": true,
	"level_id": L_EXPERIMENTAL,
	"level_text": browser.i18n.getMessage("JSSLexperimentalName"),
	"level_description": browser.i18n.getMessage("JSSLexperimentalDescription"),
	"time_precision": 3,
	"htmlcanvaselement": 2,
	"audiobuffer": 2,
	"webgl": 2,
	"plugins": 3,
	"enumerateDevices": 3,
	"hardware": 3,
	"net": 1,
	"xhr": 1,
	"arrays": 2,
	"shared_array": 2,
	"webworker": 2,
	"geolocation": 6,
  "physical_environment": 1,
	"useridle": 3,
	"coopschedule": 1,
	"gamepads": 1,
	"vr": 1,
	"playback": 3,
	"analytics": 1,
	"battery": 1,
	"windowname": 1,
	"nfc": 1,
};

// levels for canvas fingerprinting protection
// JShelter's method
var level_canvas_default = {
	"builtin": true,
	"level_id": L_CANVAS_DEFAULT,
	"level_text": "Canvas protection default",
	"level_description": "Farble the Canvas API readings the JShelter's way (Brave)",
	"htmlcanvaselement": 1,
};

// Method A
var level_canvas_5 = {
	"builtin": true,
	"level_id": L_CANVAS_PRIVARICATOR_5,
	"level_text": "Canvas protection - 5% noise",
	"level_description": "Farble the Canvas API readings by adding the 5% noise",
	"htmlcanvaselement": 3,
};

// Method B
var level_canvas_10 = {
	"builtin": true,
	"level_id": L_CANVAS_PRIVARICATOR_10,
	"level_text": "Canvas protection - 10% noise",
	"level_description": "Farble the Canvas API readings by adding the 10% noise ",
	"htmlcanvaselement": 4,
};

// FPRandom
var level_canvas_fprandom_off = {
	"builtin": true,
	"level_id": L_CANVAS_FPRANDOM_OFF,
	"level_text": "Canvas protection - FPRandom off",
	"level_description": "Farble the Canvas API readings by modifying each RGB channel of every pixel",
	"htmlcanvaselement": 5,
}

// FPRandom with random mode ON
var level_canvas_fprandom_on = {
	"builtin": true,
	"level_id": L_CANVAS_FPRANDOM_ON,
	"level_text": "Canvas protection - FPRandom on",
	"level_description": "Farble the Canvas API readings by modifying each RGB channel of every pixel, each time reinitializing the random values",
	"htmlcanvaselement": 6,
}

// Pixel smoothing
var level_canvas_pixel_smoothing = {
	"builtin": true,
	"level_id": L_CANVAS_PIXEL_SMOOTH,
	"level_text": "Canvas protection - Pixel smoothing 10%",
	"level_description": "Farble the Canvas API readings by smoothing the pixels",
	"htmlcanvaselement": 7,
}

// Noise by modifying randomly selected ImageData.data
var level_canvas_noise = {
	"builtin": true,
	"level_id": L_CANVAS_NOISE,
	"level_text": "Deprecated (noise)",
	"level_description": "Deprecated (noise)",
	"htmlcanvaselement": 8,
}

var level_canvas_default_2bits = {
	"builtin": true,
	"level_id": L_CANVAS_DEFAULT_2BITS,
	"level_text": "Canvas protection default 2 bits",
	"level_description": "Farble the Canvas API readings the Brave's way, but XOR 2 bits",
	"htmlcanvaselement": 9,
}

var level_canvas_default_3bits = {
	"builtin": true,
	"level_id": L_CANVAS_DEFAULT_3BITS,
	"level_text": "Canvas protection default 3 bits",
	"level_description": "Farble the Canvas API readings the Brave's way, but XOR 3 bits",
	"htmlcanvaselement": 10,
}

var level_canvas_default_4bits = {
	"builtin": true,
	"level_id": L_CANVAS_DEFAULT_4BITS,
	"level_text": "Canvas protection default 4 bits",
	"level_description": "Farble the Canvas API readings the Brave's way, but XOR 4 bits",
	"htmlcanvaselement": 11,
}

var level_canvas_default_5bits = {
	"builtin": true,
	"level_id": L_CANVAS_DEFAULT_5BITS,
	"level_text": "Canvas protection default 5 bits",
	"level_description": "Farble the Canvas API readings the Brave's way, but XOR 5 bits",
	"htmlcanvaselement": 12,
}

var level_canvas_default_6bits = {
	"builtin": true,
	"level_id": L_CANVAS_DEFAULT_6BITS,
	"level_text": "Canvas protection default 6 bits",
	"level_description": "Farble the Canvas API readings the Brave's way, but XOR 6 bits",
	"htmlcanvaselement": 13,
}

var level_canvas_default_7bits = {
	"builtin": true,
	"level_id": L_CANVAS_DEFAULT_7BITS,
	"level_text": "Canvas protection default 7 bits",
	"level_description": "Farble the Canvas API readings the Brave's way, but XOR 7 bits",
	"htmlcanvaselement": 14,
}

var level_canvas_15 = {
	"builtin": true,
	"level_id": L_CANVAS_PRIVARICATOR_15,
	"level_text": "Canvas protection - 15% noise",
	"level_description": "Farble the Canvas API readings by adding the 15% noise ",
	"htmlcanvaselement": 15,
}

var level_canvas_20 = {
	"builtin": true,
	"level_id": L_CANVAS_PRIVARICATOR_20,
	"level_text": "Canvas protection - 20% noise",
	"level_description": "Farble the Canvas API readings by adding the 20% noise ",
	"htmlcanvaselement": 16,
}

var level_canvas_50 = {
	"builtin": true,
	"level_id": L_CANVAS_PRIVARICATOR_25,
	"level_text": "Canvas protection - 25% noise",
	"level_description": "Farble the Canvas API readings by adding the 25% noise ",
	"htmlcanvaselement": 17,
}

var level_canvas_75 = {
	"builtin": true,
	"level_id": L_CANVAS_PRIVARICATOR_50,
	"level_text": "Canvas protection - 50% noise",
	"level_description": "Farble the Canvas API readings by adding the 50% noise ",
	"htmlcanvaselement": 18,
}

var level_canvas_pixel_smoothing20 = {
	"builtin": true,
	"level_id": L_CANVAS_PIXEL_SMOOTH20,
	"level_text": "Canvas protection - Pixel smoothing 20%",
	"level_description": "Farble the Canvas API readings by smoothing the pixels.",
	"htmlcanvaselement": 19,
}

var level_canvas_pixel_smoothing30 = {
	"builtin": true,
	"level_id": L_CANVAS_PIXEL_SMOOTH30,
	"level_text": "Canvas protection - Pixel smoothing 30%",
	"level_description": "Farble the Canvas API readings by smoothing the pixels",
	"htmlcanvaselement": 20,
}
var level_canvas_pixel_smoothing50 = {
	"builtin": true,
	"level_id": L_CANVAS_PIXEL_SMOOTH50,
	"level_text": "Canvas protection - Pixel smoothing 50%",
	"level_description": "Farble the Canvas API readings by smoothing the pixels",
	"htmlcanvaselement": 21,
}

var level_canvas_mapping_1 = {
	"builtin": true,
	"level_id": L_CANVAS_MAPPING_1,
	"level_text": "Canvas protection - Mapping thr. 1 (irelevant)",
	"level_description": "Farble the Canvas API readings by mapping the colors, but threshold 1 is irrelevant. I don't delete it as it would break the build",
	"htmlcanvaselement": 22,
}
var level_canvas_mapping_2 = {
	"builtin": true,
	"level_id": L_CANVAS_MAPPING_2,
	"level_text": "Canvas protection - Mapping thr. 2",
	"level_description": "Farble the Canvas API readings by mapping the colors",
	"htmlcanvaselement": 23,
}
var level_canvas_mapping_3 = {
	"builtin": true,
	"level_id": L_CANVAS_MAPPING_3,
	"level_text": "Canvas protection - Mapping thr. 3",
	"level_description": "Farble the Canvas API readings by mapping the colors",
	"htmlcanvaselement": 24,
}
var level_canvas_mapping_4 = {
	"builtin": true,
	"level_id": L_CANVAS_MAPPING_4,
	"level_text": "Canvas protection - Mapping thr. 4",
	"level_description": "Farble the Canvas API readings by mapping the colors",
	"htmlcanvaselement": 25,
}
var level_canvas_mapping_5 = {
	"builtin": true,
	"level_id": L_CANVAS_MAPPING_5,
	"level_text": "Canvas protection - Mapping thr. 5",
	"level_description": "Farble the Canvas API readings by mapping the colors",
	"htmlcanvaselement": 26,
}

var level_canvas_mapping_10 = {
	"builtin": true,
	"level_id": L_CANVAS_MAPPING_10,
	"level_text": "Canvas protection - Mapping thr. 10",
	"level_description": "Farble the Canvas API readings by mapping the colors",
	"htmlcanvaselement": 27,
}

var level_canvas_mapping_50 = {
	"builtin": true,
	"level_id": L_CANVAS_MAPPING_50,
	"level_text": "Canvas protection - Mapping thr. 50",
	"level_description": "Farble the Canvas API readings by mapping the colors",
	"htmlcanvaselement": 28,
}

var level_canvas_mapping_100 = {
	"builtin": true,
	"level_id": L_CANVAS_MAPPING_100,
	"level_text": "Canvas protection - Mapping thr. 100",
	"level_description": "Farble the Canvas API readings by mapping the colors",
	"htmlcanvaselement": 29,
}
var level_canvas_mapping_1000 = {
	"builtin": true,
	"level_id": L_CANVAS_MAPPING_1000,
	"level_text": "Canvas protection - Mapping thr. 1000",
	"level_description": "Farble the Canvas API readings by mapping the colors",
	"htmlcanvaselement": 30,
}
var level_canvas_mapping_10000 = {
	"builtin": true,
	"level_id": L_CANVAS_MAPPING_10000,
	"level_text": "Canvas protection - Mapping thr. 10000",
	"level_description": "Farble the Canvas API readings by mapping the colors",
	"htmlcanvaselement": 31,
}
var level_canvas_mapping_100000 = {
	"builtin": true,
	"level_id": L_CANVAS_MAPPING_100000,
	"level_text": "Canvas protection - Mapping thr. 100000",
	"level_description": "Farble the Canvas API readings by mapping the colors",
	"htmlcanvaselement": 32,
}

var level_canvas_mapping_1000000 = {
	"builtin": true,
	"level_id": L_CANVAS_MAPPING_1000000,
	"level_text": "Canvas protection - Mapping thr. 1000000",
	"level_description": "Farble the Canvas API readings by mapping the colors",
	"htmlcanvaselement": 33,
}


var level_canvas_mapping_10000000 = {
	"builtin": true,
	"level_id": L_CANVAS_MAPPING_10000000,
	"level_text": "Canvas protection - Mapping thr. 10000000",
	"level_description": "Farble the Canvas API readings by mapping the colors",
	"htmlcanvaselement": 34,
}



var modify_builtin_levels = modify_builtin_levels || (() => null); // Give other scripts the possibility to modify builtin levels
modify_builtin_levels();

var levels = {};
var default_level = {};
var domains = {};
function init_levels() {
	levels = {
		[level_0.level_id]: level_0,
		[level_1.level_id]: level_1,
		[level_2.level_id]: level_2,
		[level_3.level_id]: level_3,
		[level_experimental.level_id]: level_experimental,
		[level_canvas_default.level_id]: level_canvas_default,
		[level_canvas_5.level_id]: level_canvas_5,
		[level_canvas_10.level_id]: level_canvas_10,
		[level_canvas_fprandom_off.level_id]: level_canvas_fprandom_off,
		[level_canvas_fprandom_on.level_id]: level_canvas_fprandom_on,
		[level_canvas_pixel_smoothing.level_id]: level_canvas_pixel_smoothing,
		[level_canvas_noise.level_id]: level_canvas_noise,
		[level_canvas_default_2bits.level_id]: level_canvas_default_2bits,
		[level_canvas_default_3bits.level_id]: level_canvas_default_3bits,
		[level_canvas_default_4bits.level_id]: level_canvas_default_4bits,
		[level_canvas_default_5bits.level_id]: level_canvas_default_5bits,
		[level_canvas_default_6bits.level_id]: level_canvas_default_6bits,
		[level_canvas_default_7bits.level_id]: level_canvas_default_7bits,
		[level_canvas_15.level_id]: level_canvas_15,
		[level_canvas_20.level_id]: level_canvas_20,
		[level_canvas_50.level_id]: level_canvas_50,
		[level_canvas_75.level_id]: level_canvas_75,
		[level_canvas_pixel_smoothing20.level_id]: level_canvas_pixel_smoothing20,
		[level_canvas_pixel_smoothing30.level_id]: level_canvas_pixel_smoothing30,
		[level_canvas_pixel_smoothing50.level_id]: level_canvas_pixel_smoothing50,
		[level_canvas_mapping_1.level_id]: level_canvas_mapping_1,
		[level_canvas_mapping_2.level_id]: level_canvas_mapping_2,
		[level_canvas_mapping_3.level_id]: level_canvas_mapping_3,
		[level_canvas_mapping_4.level_id]: level_canvas_mapping_4,
		[level_canvas_mapping_5.level_id]: level_canvas_mapping_5,
		[level_canvas_mapping_10.level_id]: level_canvas_mapping_10,
		[level_canvas_mapping_50.level_id]: level_canvas_mapping_50,
		[level_canvas_mapping_100.level_id]: level_canvas_mapping_100,
		[level_canvas_mapping_1000.level_id]: level_canvas_mapping_1000,
		[level_canvas_mapping_10000.level_id]: level_canvas_mapping_10000,
		[level_canvas_mapping_100000.level_id]: level_canvas_mapping_100000,
		[level_canvas_mapping_1000000.level_id]: level_canvas_mapping_1000000,
		[level_canvas_mapping_10000000.level_id]: level_canvas_mapping_10000000,
	};
	default_level = Object.create(levels[L_CANVAS_DEFAULT]);
	default_level.level_text = "Default";
	domains = {};
}
init_levels();

let levels_initialised = false; // Initialized in updateLevels()
let fp_levels_initialised = false; // Initialized in fp_levels.js/loadFpdConfig()
let levels_updated_callbacks = [];
var tweak_domains = tweak_domains || {};
function updateLevels(res) {
	init_levels();
	custom_levels = res["custom_levels"] || {};
	for (let key in custom_levels) {
		levels[key] = custom_levels[key];
	}
	for (let key in levels) {
		levels[key].wrappers = wrapping_groups.get_wrappers(levels[key]);
	}
	var new_default_level = res["__default__"];
	if (new_default_level === undefined || new_default_level === null || !(new_default_level in levels)) {
		default_level = Object.assign({}, levels[L_CANVAS_DEFAULT]);
		setDefaultLevel(L_CANVAS_DEFAULT);
	}
	else {
		default_level = Object.assign({}, levels[new_default_level]);
	}
	default_level.is_default = true;
	var redefined_domains = res["domains"] || {};
	for (let [d, settings] of Object.entries(tweak_domains)) {
		if ((settings.level_id === default_level.level_id) && !(d in redefined_domains)) {
			redefined_domains[d] = settings;
		}
	}
	for (let [d, {level_id, tweaks, restore, restore_tweaks}] of Object.entries(redefined_domains)) {
		let level = levels[level_id];
		if (level === undefined) {
			domains[d] = default_level;
		}
		else {
			if (tweaks) {
				// this domain has "tweaked" wrapper groups from other levels, let's merge them
				level = Object.assign({}, level, tweaks);
				level.tweaks = tweaks;
				delete level.wrappers; // we will lazy instantiate them on demand in getCurrentLevelJSON()
			}
			if (restore) {
				level.restore = restore;
				if (restore_tweaks) {
					level.restore_tweaks = restore_tweaks;
				}
			}
		}
		domains[d] = level;
	}

	levels_initialised = true;
	if (fp_levels_initialised) { // Wait for both levels_initialised and fp_levels_initialised
		var orig_levels_updated_callbacks = levels_updated_callbacks;
		levels_updated_callbacks = [];
		orig_levels_updated_callbacks.forEach((it) => it());
	}
}
browser.storage.sync.get(null).then(updateLevels);

function changedLevels(changed, area) {
	browser.storage.sync.get(null).then(updateLevels);
}
browser.storage.onChanged.addListener(changedLevels);

function setDefaultLevel(level) {
	browser.storage.sync.set({__default__: level});
}

function saveDomainLevels() {
	tobesaved = {};
	for (k in domains) {
		let {level_id, tweaks, restore, restore_tweaks} = domains[k];
		if (k[k.length - 1] === ".") {
			k = k.substring(0, k.length-1);
		}
		// Do not save built-in tweaks as they are automatically added in updateLevels
		if (k in tweak_domains) {
			// Skip further check if the user has a different default_level
			if (tweak_domains[k].level_id === default_level.level_id) {
				tdb_tweaks = Object.entries(tweak_domains[k].tweaks);
				current_tweaks = Object.entries(domains[k].tweaks);
				if (tdb_tweaks.length === current_tweaks.length) {
					var equal = true;
					for ([name, val] of tdb_tweaks) {
						if (domains[k].tweaks[name] !== val) {
							equal = false;
							break;
						}
					}
					if (equal) {
						// This entry should not be saved
						continue;
					}
				}
			}
		}
		if (tweaks) {
			for (let [group, param] of Object.entries(tweaks)) {
				if (param === (levels[level_id][group] || 0)) {
					delete tweaks[group]; // remove redundant entries
				}
			}
			if (Object.keys(tweaks).length === 0) {
				tweaks = undefined;
			}
		}
		tobesaved[k] = tweaks ? {level_id, tweaks} : {level_id};
		if (restore) {
			tobesaved[k].restore = restore;
			if (restore_tweaks) {
				tobesaved[k].restore_tweaks = restore_tweaks;
			}
		}
	}
	browser.storage.sync.set({domains: tobesaved});
}

function getCurrentLevelJSON(url) {
	var subDomains = extractSubDomains(getEffectiveDomain(url));
	for (let domain of subDomains.reverse()) {
		if (domain in domains) {
			let l = domains[domain];
			if (l.tweaks) {
				l.wrappers = wrapping_groups.get_wrappers(l);
			}
			return l;
		}
	}
	return default_level;
}

function getTweaksForLevel(level_id, tweaks_obj) {
	tweaks_obj = tweaks_obj || {}; // Make sure that tweaks_obj is an object
	let working = Object.assign({}, wrapping_groups.empty_level, levels[level_id], tweaks_obj);
	Object.keys(working).forEach(function(key) {
		if (!wrapping_groups.group_names.includes(key)) {
			delete working[key];
		}
	});
	return working;
}
