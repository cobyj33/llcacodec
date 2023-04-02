
# cacodec.js

cacodec.js is a library written in Typescript to decode and encode [Life-Like Cellular Automata](https://conwaylife.com/wiki/Life-like_cellular_automaton) data files.

> NOTE: This documentation is not meant to serve as a in-depth guide on the intricacies and specifications of 
> different file formats and rule formats, but instead, this documentation shows **the abilities of cacodec.js**, mostly
> so others can see if it fits their use-case. If there is anything that may be missing or broken, please don't hesitate
> to leave an issue at the Github page so that either I can fix it, or I'm completely open to accepting pull requests with
> improvements as well.

cacodec.js can be used in both the browser and in node.js, and is compiled to ES6 syntax.
cacodec.js has no dependencies, but this isn't guaranteed to stay true as the library grows

## Table of Contents

- [cacodec.js](#cacodecjs)
  - [Table of Contents](#table-of-contents)
  - [API](#api)
    - [readLifeString](#readlifefile)
    - [readLifeFileLiveCoordinates](#readlifefilelivecoordinates)
    - [getLifeFileFormat](#getlifefileformat)
    - [readLifeRule](#readliferule)
    - [makeLifeRule](#makeliferule)
    - [isValidLifeRule](#isvalidliferule)
    - [getLifeRuleFormat](#getliferuleformat)
  - [Rules](#rules)
  - [File Formats](#file-formats)
    - [Supported File Formats](#supported-file-formats)
    - [Unsupported File Formats](#unsupported-file-formats)
  - [FAQ (not really)](#faq-not-really)


## API

llcacodecjs comes with 7 simple public functions:

- readLifeString
- readLifeFileLiveCoordinates
- getLifeFileFormat
- readLifeRule
- makeLifeRule
- isValidLifeRule
- getLifeRuleFormat

### readLifeString

**readLifeString** takes in a string representing the file data, as well as an optional format identifier representing either the inputted format or "". This optional format identifier cannot be null or undefined, or else an error is thrown. The optional format identifier can either 

readLifeString(data: string, format: "plaintext" | "life 1.06" | "rle" | "life 1.05" | "")

upon 

### readLifeFileLiveCoordinates

### getLifeFileFormat

### readLifeRule

### makeLifeRule

### isValidLifeRule

### getLifeRuleFormat

The implementation and specific overloads of each function
can be found in the source files

## Rules

- B/S Notation (Encoding and Decoding) [LifeWiki](https://conwaylife.com/wiki/Rulestring)
- S/B Notation (Encoding and Decoding) [LifeWiki](https://conwaylife.com/wiki/Rulestring)
- Rule Integer (Encoding and Decoding) [LifeWiki](https://conwaylife.com/wiki/Rulestring)

## File Formats

### Supported File Formats

- Life 1.05 (Decoding and Encoding) [LifeWiki](https://conwaylife.com/wiki/Life_1.05)
- Life 1.06 (Decoding and Encoding) [LifeWiki](https://conwaylife.com/wiki/Life_1.06)
- plaintext (Decoding and Encoding) [LifeWiki](https://conwaylife.com/wiki/Plaintext)
- RLE (Run Length Encoded) (Decoding) [LifeWiki](https://conwaylife.com/wiki/Run_Length_Encoded)

### Unsupported File Formats

- Extended RLE Format | [Golly Source Format Documentation](https://golly.sourceforge.net/Help/formats.html#rle)
- MacroCell Format | [Golly Source Format Documentation](https://golly.sourceforge.net/Help/formats.html#rle)
- Rule Format | [Golly Source Format Documentation](https://golly.sourceforge.net/Help/formats.html#rle)
- Small Object Format | [LifeWiki](https://conwaylife.com/wiki/Small_object_format) [Pentdecathlon](https://web.archive.org/web/20211102020428/http://pentadecathlon.com/objects/definitions/definitions.php)

## FAQ (not really)

- Can I use llcacodecjs with CommonJS modules

Currently, no. It's coming, but not yet, as the API itself is not even stable, and I see that as more important

- How can I get my file formats

On browser, the preferred format would probably be using the fetch API, like this

```js
import { readLifeString } from "llcacodecjs"

// Using linked promises

fetch("my/path")
.then(res => res.text())
.then(str => readLifeString(str))
.then(data => console.log("Do something with this data", data));

// using an async function

async function fetchLifeLikeFileData(pathOrURL) {
    const textFile = await fetch(pathOrURL).then(res => res.text())
    const data = readLifeString(textFile)
    return data;
}

fetchLifeLikeFileData("my/path");

```

Similarly, in node.js, the fs/promises module could be used

```js
import fs from "fs/promises"

//through promises

fs.readFileAsync("my/path")
.then(buffer => readLifeString(buffer.toString()))

// using an async function

async function fetchLifeLikeFileData(pathOrURL) {
    const textFile = await fs.readFileAsync(pathOrURL).then(buffer => buffer.toString())
    const data = readLifeString(textFile)
    return data;
}

fetchLifeLikeFileData("my/path")

```
