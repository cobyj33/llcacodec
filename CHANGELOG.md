
# llcacodec Changelog

## April 11: Version 0.1.4

Add all exported functions as default from src/api.ts

Add bundling for browser iife, cjs, and mjs minified versions

Add esbuild developer dependency

Add build scripts for iife, cjs, and mjs minified scripts

Changed package.json "fies" to only include ./dist/api.js, ./dist/formats, ./dist/core, and ./dist/types

## April 10: Version 0.1.4

Bump to version 0.1.4

Add "PATTERNS.md" to distributed files

Add "DOCUMENTATION.md" to distributed files

Remove "LICENSE" from distributed files, as the LICENSE file is
automatically included by npm

## April 10: Version 0.1.3

Add documentation to src/core/set2D.ts

Add documentation to src/api.ts

Fold DOCUMENTATION.md to be no more than 90 characters per line

Add PATTERNS.md, which gives links toward different pattern collections.  

Remove pattern collection links from DEV_DOCUMENTATION.md.

Fold CHANGELOG.md to 80 character line widths

Remove link to DEV_DOCUMENTATION.md in README.md

Add link to PATTERNS.md in README.md

Remove "unwritten" warning from DEV_DOCUMENTATION.md

Fixed error with plaintext with reading carraige returns

Fixed error with Life105 with the presence of empty cell blocks throwing errors.

## April 8, 2023: Version 0.1.1

Pushed to npm registry, Bump version to 0.1.1

Updated package.json with git repo, included files, license, bug report url,
and more keywords

Restructured README.md to contain the logo and description directly after the
header

Patch bug with RLE file format not being recognized

Gifs added to README.md

## April 2, 2023: Version 0.1.0

Fixed throws function, as output was returning true when not throwing and false
when throwing, which is
the opposite of what should have been happening

## April 1, 2023: Version 0.1.0

Changed all functions with "PlainText" in the name to "Plaintext" instead

Completely removed the concept of "Byte Arrays" and the functions
byteArrayToASCII and pushASCIIBytes. Instead, strings are build by simply using
an array of strings that are joined upon return

Changed name to just be llcacodec from llcacodec.js

Added RLE File Writing

Fixed Life 1.05 Reading

## March 30, 2023: Version 0.1.0

Removed public api function readLifeFileLiveCoordinates. Now all file types
return coordinates, and they can be read through readLifeFile(string,
format).liveCoordinates

Added public function isLifeStringFormat to check if a string conforms with a
specific file format

Changed all decoded data to return the name of its format along with itself

Changed all encoding data interfaces to require the name of its format along
with itself

Changed all decoded data interfaces to match the pattern
(FILE_TYPE_NAME)DecodedData

Changed all encoding data interfaces to match the pattern
(FILE_TYPE_NAME)EncodingData

Changed readLifeFile overload for unknown file types to not accept a second
parameter

Changed RLEDecodedData to default topleft to [0, 0] and include a new field
"foundTopLeft" for if a custom top left coordinate was found
