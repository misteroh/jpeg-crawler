'use strict'
// requires
const fs = require('fs');
const q = require('q');
const jf = require('jsonfile');
const exif = require('exif').ExifImage;

// globals
const cwd = process.cwd();
const args = process.argv.slice(2);
const imageDirectory = args[0] || cwd;
const outputFilename = args[1] || 'output.json';

function cleanOutput(file) {
	const dfd = q.defer();

	console.log(`Deleting ${file}...`);

	fs.unlink(file, error => {
		if (error) {
			dfd.resolve(`Tried to delete ${file} but the operation was not successful.`);
		} else {
			dfd.resolve(`Deleted ${file}`);
		}
	});

	return dfd.promise;
}

function createJSONFile(jsonFilename) {
	const dfd = q.defer();

    jf.writeFile(jsonFilename, {}, error => {
		dfd.resolve(`Created ${jsonFilename}`);
	});

	return dfd.promise;
}

function getEXIFData(filename) {
	const dfd = q.defer();

	console.log(`Scanning ${filename}`);

	try {
		new exif({ image : filename }, (error, exifData) => {
			if (error) {
				dfd.reject(error.message);
			} else {
				dfd.resolve(exifData.exif);
			}
		});
	} catch (error) {
		dfd.reject(error);
	}

	return dfd.promise;
}

function crawlDirectory(directory) {

}

cleanOutput(outputFilename)
	.then(response => {
		console.log(`${response}\nNow crawling the folder "${imageDirectory}"...`);
		return createJSONFile(outputFilename);
	}).then(response => {
		console.log(`${response}`);
		return getEXIFData('test1.jpg');
	}).then(response => {
		jf.writeFile(outputFilename, response)
	});




























function getExif(o) {
    const file = o.file;
    let fullPath = o.fullPath;
    let listOfData = o.listOfData;
    let currentFolder = o.currentFolder;
    let dimensions = o.dimensions;
    let final = o.final;

    try {
        new Exif({ image : fullPath }, function (error, exifData) {
            if (error)
                console.log('Error: '+error.message);
            else {
                listOfData.push({
                    title: 'Title',
                    src: file,
                    caption: exifData.image.ImageDescription,
                    width: dimensions.width,
                    height: dimensions.height
                });
                if (final === true) {
                    writeJson(currentFolder, listOfData);
                }
            }
        });
    } catch (error) {
        console.log('Error: ' + error.message);
    }
}

// for (i = 0; i < imageFoldersLength; i++) {
//     const currentFolder = imageFolders[i],
//         files = [],
//         listOfData = [],
//         lengthOfList,
//         index = 0;
//
//     fs.readdirSync(cwd + '/app/images/' + currentFolder).forEach(function(element) {
//         if(path.extname(element) === ".jpg") {
//             files.push(element);
//         }
//     });
//
//     lengthOfList = files.length;
//
//     files.forEach(function(element) {
//         const fullPath = cwd + '\\app\\images\\' + currentFolder + '\\' + element,
//             dimensions = sizeOf(fullPath),
//             final;
//
//         index = index + 1;
//         final = index === lengthOfList ? true : false;
//
//         getExif({
//             file: element,
//             fullPath: fullPath,
//             listOfData: listOfData,
//             currentFolder: currentFolder,
//             dimensions: dimensions,
//             final: final
//         });
//     });
// }
