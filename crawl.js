'use strict'
// requires
const fs = require('fs');
const glob = require('glob');
const q = require('q');
const jf = require('jsonfile');
const Exif = require('exif').ExifImage;

// globals
const cwd = process.cwd();
const args = process.argv.slice(2);
const imageDirectory = args[0] || cwd;
const outputFilename = args[1] || 'output.json';

function cleanOutput(file) {
	const dfd = q.defer();

	fs.unlink(file, error => {
		if (error) {
			dfd.resolve(`Tried to delete ${file} but the operation was not successful.`);
		} else {
			dfd.resolve(`Deleted ${file}`);
		}
	});

	return dfd.promise;
}

function createJSONFile(file) {
	const dfd = q.defer();

	console.log(`Creating ${file}...`);

    jf.writeFile(file, {}, error => {
		dfd.resolve(`Created ${file}`);
	});

	return dfd.promise;
}

function getJPEGs(folder) {
	const dfd = q.defer();

	glob('testFolder/*.+(jpg|jpeg)', (error, files) => {
		dfd.resolve(files);
	});

	return dfd.promise;
}

function getEXIFOfAllFiles(jpegs) {
	const dfd = q.defer();
	const numberOfJpegs = jpegs.length;
	const output = {
		images: []
	};

	function getEXIFOfSingleFile(i) {
		const filePath = jpegs[i];

		try {
			new Exif({ image : filePath }, (error, exifData) => {
				if (error) {
					return prev;
				} else {
					const data = exifData;

					data.filename = filePath.split('/').slice(-1)[0];
					data.filepath = filePath;

					output.images.push(data);

					if (i < numberOfJpegs - 1) {
						return getEXIFOfSingleFile(i+1);
					}

					dfd.resolve(output);
				}
			});
		} catch (error) {
			return prev;
		}
	}

	getEXIFOfSingleFile(0);

	return dfd.promise;
}

function writeJSONFile(outputFile, data) {
	console.log(`Writing to ${outputFile}`);

	return jf.writeFile(outputFile, data);
}

cleanOutput(outputFilename)
	.then(response => createJSONFile(outputFilename))
	.then(() => getJPEGs('testFolder'))
	.then(jpegs => getEXIFOfAllFiles(jpegs))
	.then(exifData => writeJSONFile(outputFilename, exifData))
	.catch(error => {
		console.error(error);
	});
