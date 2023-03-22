
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
  - [Rules](#rules)
  - [File Formats](#file-formats)
    - [Supported File Formats](#supported-file-formats)
    - [Unsupported File Formats](#unsupported-file-formats)


## API

cacodec.js comes with two main functions, 

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

- Extended RLE Format
- MacroCell Format
- Rule Format
- Small Object Format [LifeWiki](https://conwaylife.com/wiki/Small_object_format) [Pentdecathlon](https://web.archive.org/web/20211102020428/http://pentadecathlon.com/objects/definitions/definitions.php)

- [Golly](https://golly.sourceforge.net/) File Formats: [Golly Source Format Documentation](https://golly.sourceforge.net/Help/formats.html#rle)
