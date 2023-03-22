
# cacodec.js

cacodec.js is a library written in Typescript to decode and encode [Life-Like Cellular Automata](https://conwaylife.com/wiki/Life-like_cellular_automaton) data files.

> NOTE: This documentation is not meant to serve as a in-depth guide on the intricacies and specifications of 
> different file formats and rule formats, but instead, this documentation shows **the abilities of cacodec.js**, mostly
> so others can see if it fits their use-case. If there is anything that may be missing or broken, please don't hesitate
> to leave an issue at the Github page so that either I can fix it, or I'm completely open to accepting pull requests with
> improvements as well.

cacodec.js can be used in both the browser and in node.js, and is compiled to ES6 syntax.
cacodec.js has no dependencies 

## API

cacodec.js comes with two main functions, 

## Rules

- B/S Notation [LifeWiki](https://conwaylife.com/wiki/Rulestring)
- S/B Notation [LifeWiki](https://conwaylife.com/wiki/Rulestring)
- Rule Integer [LifeWiki](https://conwaylife.com/wiki/Rulestring)

## File Formats

### Supported (Encoding and Decoding)

- Life 1.05 [LifeWiki](https://conwaylife.com/wiki/Life_1.05)
- Life 1.06 [LifeWiki](https://conwaylife.com/wiki/Life_1.06)
- plaintext [LifeWiki](https://conwaylife.com/wiki/Plaintext)
- RLE (Run Length Encoded) [LifeWiki](https://conwaylife.com/wiki/Run_Length_Encoded)

### Unsupported & Further Reading

- [Golly](https://golly.sourceforge.net/) File Formats: [Golly Source Format Documentation](https://golly.sourceforge.net/Help/formats.html#rle)
  - Extended RLE Format
  - MacroCell Format
  - Rule Format
- Small Object Format [LifeWiki](https://conwaylife.com/wiki/Small_object_format) [Pentdecathlon](https://web.archive.org/web/20211102020428/http://pentadecathlon.com/objects/definitions/definitions.php)
