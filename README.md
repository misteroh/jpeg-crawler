# jpeg-crawler
Node.js utility that crawls a directory of images and spits out JSON containing certain metadata of each image

## Usage

```
node crawl exampleOutput.json exampleImagesFolder
```

The first parameter is the name of the output JSON file. If omitted, `crawl` will save to `output.json` in the same directory as `crawl.js`.

The second parameter specifies where to look for the images to crawl. If omitted, `crawl` will look for all `jpg`/`jpeg` files inside the same directory as `crawl.js`.

## Example
Given the following directory structure:

```
directory
|── crawl.js
└── exampleImagesFolder
    ├── a.jpg
    └── b.jpg

```

Running
```
node crawl exampleOutput.json exampleImagesFolder
```

...will create the file `exampleOutput.json` containing EXIF data for all `jpg` and `jpeg` files inside `exampleImagesFolder`.
