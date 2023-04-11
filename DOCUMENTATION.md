
# llcacodec 0.1.5

llcacodec is a library written in Typescript to decode and encode
[Life-Like Cellular Automata](https://conwaylife.com/wiki/Life-like_cellular_automaton)
data rules and files.

Since this is a very simple, targeted library, all details concerning
llcacodec should be present inside of this DOCUMENTATION.md file

Install through npm:  
```npm install --save-exact llcacodec```

Install through yarn:  
```yarn add --exact llcacodec```

> NOTE: This documentation is not meant to serve as a in-depth guide on
> the intricacies and specifications of different file formats and rule
> formats, but instead, this documentation shows **the abilities of llcacodec**.
> This documentation serves to help readers understand if llcacodec fits their
> unique use case. If there is anything that may be omitted, explained poorly,
> outdated, or explained incorrectly, please don't hesitate to leave an issue at
> the [llcacodec github page](https://www.github.com/cobyj33/llcacodec), so
> that the problem could be addressed accordingly.

llcacodec can be used in any javascript environment: node or browser.
This is because llcacodec has no dependencies, and is completely self-contained,
so anywhere that can run ES6 Javascript can run llcacodec.

llcacodec is written in Typescript and compiled to ES6 Javascript.

llcacodec ,when downloaded from npm or yarn, can be used from
both ES modules and CommonJS modules. Additionally, it is also built and distributed
in minified versions in the dist/ directory of the llcacodec repository, which can be
used in ES modules, CommonJS modules, or the ```<script></script>``` html tag. These minified
versions and their source maps can simply be copied and used accordingly if the user so wishes,
and they are explained further in [the dist README](dist/README.md)

## Table of Contents

- [llcacodec 0.1.5](#llcacodec-015)
  - [Table of Contents](#table-of-contents)
  - [Quickstart](#quickstart)
    - [Quickstart - Files](#quickstart---files)
    - [Quickstart - Rules](#quickstart---rules)
    - [Quickstart - Continue](#quickstart---continue)
  - [Entry Points](#entry-points)
  - [Files](#files)
    - [Files - Reading](#files---reading)
    - [Files - Writing](#files---writing)
    - [Files - Querying](#files---querying)
    - [Files - Extra](#files---extra)
  - [Rules](#rules)
    - [Rules - Parsed Rule Data](#rules---parsed-rule-data)
    - [Rules - Creating Rules](#rules---creating-rules)
    - [Rules - Reading Rules](#rules---reading-rules)
    - [Rules - Getting Rule Formats](#rules---getting-rule-formats)
    - [Rules - Validating Rules](#rules---validating-rules)
    - [Rules - Converting Rules](#rules---converting-rules)
  - [FAQ (not really, but I suspect so)](#faq-not-really-but-i-suspect-so)

---

## Quickstart

### Quickstart - Files

Files can be loaded by simply fetching the files' contents, converting those
contents to a string, and then calling **readLifeString** with the life-like
file string as first argument. **readLifeString** returns an object with the
data parsed from the given string. The data parsed varies between each file
format read by **readLifeString**, but returned object is guaranteed to have
the keys **format** and **liveCoordinates**, where **format** is a string of
either "rle", "life 1.05", "life 1.06", or "plaintext", which tells the format
of the read data. **liveCoordinates** is an array of the coordinates of each
live cell read from the parsed data. Entries in **liveCoordinates** are
formatted as [x, y], where the x coordinate is positive to the right and
negative to the left, and the y coordinate is positive upwards and negative
downward. Some examples of reading can be found in the
[FAQ](#faq-not-really-but-i-suspect-so). If you simply want to load files, you
can stop reading here.

> NOTE: It is good to remember that the coordinate data in the
**liveCoordinates** key returned by **readLifeString** is similar to a
mathematical plane where positive y is upward. If the user is parsing the data
in an area for use in a program where positive y is downward, the coordinates
would then have to simply be flipped to -y. This can be done with a simple call
such as ```const coordinates = data.liveCoordinates.map(([x, y]) => ([x, -y]))```

### Quickstart - Rules

Rules can be created with the **makeLifeRule** function and read with the
**readLifeRule** function. **makeLifeRule** takes in an object
with the keys "birth" and "survival", where birth and survival are arrays of
numbers which detail how many live neighbors
must be around a dead cell for that dead cell to come alive, and how many live
neighbors must be around an alive cell
for that alive cell to survive. **readLifeRule** similarly returns this same
described object above, but instead takes in a Life Like Rule instead.

Both **makeLifeRule** and **readLifeRule** are imported through the
```js "llcacodec/rule"``` import endpoint.
An example use of this import statement can be seen below.
```js import { makeLifeRule, readLifeRule } from "llcacodec/rule"```

### Quickstart - Continue

If you simply want to load files and rules, you can stop reading here.

If you're wondering what even is a Life-Like file, what is a Life-Like rule,
and what are considered to be valid formats of these both, you can continue
reading.

> While functions' explanations may look complicated and long-winded, it is
> simply for the sake of robustness and clarity. All functions do
> what they are literally named to do, so there should be no confusion on a
> function's purpose even without reading this documentation

---

## Entry Points

llcacodec ships three different entry points: "llcacodec", "llcacodec/file", and "llcacodec/rule".

"llcacodec" is a congregated import for both file and rule manipulation functions, while "llcacodec/file"
and "llcacodec/rule" are created to export file manipulation and rule manipulation functions respectively.

Everything seen in the Files section below is included in llcacodec/file, while everything included in the
Rules section below is included in llcacodec/rule.

---

## Files

All files in llcacodec are handled as strings containing all of the files'
contents. This is why no functions are necessarily available that contain the
word "file" within, as they can be used for any type of string which contains
valid Life-Like data.

Files can be read with these formats:

- [Life 1.05](https://conwaylife.com/wiki/Life_1.05)
- [Life 1.06](https://conwaylife.com/wiki/Life_1.06)
- [Plaintext](https://conwaylife.com/wiki/Plaintext)
- [Run-Length Encoded (RLE)](https://conwaylife.com/wiki/Run_Length_Encoded).

Files can be written with these formats:

- [Life 1.06](https://conwaylife.com/wiki/Life_1.06)
- [Plaintext](https://conwaylife.com/wiki/Plaintext)
- [Run-Length Encoded (RLE)](https://conwaylife.com/wiki/Run_Length_Encoded)

### Files - Reading

Files are read with the function **readLifeString**, where **readLifeString**
takes in an argument for the string to read as data.

Additionally, **readLifeString** can take a second argument denoting the
specific format to read from the provided string.
**readLifeString** can read files specifically in the formats "life 1.06",
"life 1.05", "rle", and "plaintext".
This forces **readLifeString** to parse the given life-like string in a
specific format.
**readLifeString** will throw an error if any complications are encountered
while parsing the file, or if the file does not
fit any implemented decoding formats in llcacodec. It is then recommended to
always handle **readLifeString**
by catching any errors for strings which are not guaranteed to be valid, or
from which the source of the data
is not guaranteed to provide perfect data.

**readLifeString** returns different objects depending on the given life
string's format.
However, each returned object is guaranteed to have the fields **"format"** and
**"liveCoordinates"**.
**"format"** is the given format of the read life string, which will always be
a string of "life 1.06", "life 1.05", "rle", or "plaintext".
Additonally, **"liveCoordinates"** is an array of the coordinates of each live
cell read from the parsed data.
Entries in **liveCoordinates** are formatted as [x, y], where the x coordinate
is positive to the right and negative to the left, and the y coordinate is
positive upwards and negative downward.

Every format has one specific object format that will be returned from
**readLifeString**. This means that, for example, if my returned object
contained a format of "rle", I would know that the key "topleft" is guaranteed
to exist. The returned interfaces can all be seen below:

If the returned object from **readLifeString** has a "format" tag of "life 1.06"

```ts
interface Life106DecodedData {
    format: "life 1.06"
    liveCoordinates: [number, number][]
}
```

If the returned object from **readLifeString** has a "format" tag of "plaintext"

```ts
interface PlaintextDecodedData {
    format: "plaintext"
    name: string
    description: string[]
    matrix: (0 | 1)[][]
    liveCoordinates: [number, number][]
}
```

If the returned object from **readLifeString** has a "format" tag of "life 1.05"

```ts
interface Life105CellBlock {
    x: number,
    y: number,
    width: number,
    height: number,
    pattern: (0 | 1)[][]
    liveCoordinates: [number, number][]
}

interface Life105DecodedData {
    format: "life 1.05"
    cellBlocks: Life105CellBlock[]
    liveCoordinates: [number, number][]
    descriptions: string[],
    rule: string | null,
    parsedRule: LifeRuleData | null,
    hashLines: HashLine[]
}
```

If the returned object from  **readLifeString** has a "format" tag of "rle"

```ts
interface RLEDecodedData {
    format: "rle"
    comments: string[],
    name: string,
    topleft: [number, number],
    foundTopLeft: boolean,
    width: number,
    height: number,
    ruleString: string,
    rule: LifeRuleData,
    liveCoordinates: [number, number][],
    hashLines: HashLine[],
    creationData: string
}
```

### Files - Writing

Files are written with the **writeLifeString** function, where the function is
passed an object with the data necessary to create a Life-Like string with
proper data. This returned string could be written to a file and used in other
Life-Like programs as well. The passed data is different for every format, but
it is required that the passed data contains a key **"format"** which denotes
the format of the written data. Currently, this data could be written in the
"rle", "life 1.06", and "plaintext" formats. After this **"format"** key, the
data provided varies as seen below.

If the targeted format for **writeLifeString** is "life 1.06":

```ts
interface Life106EncodingData {
    format: "life 1.06"
    liveCoordinates: [number, number][]
}
```

If the targeted format for **writeLifeString** is "plaintext", the data can be
provided in any one of these two forms:

```ts
interface PlaintextMatrixWriteData {
    format: "plaintext",
    name: string,
    description: string | string[]
    matrix: (0 | 1)[][]
}

interface PlaintextCoordinateWriteData {
    format: "plaintext",
    name: string,
    description: string | string[]
    liveCoordinates: [number, number][]
}
```

If the targeted format for **writeLifeString** is "rle", the data can be
provided in any one of these two forms:

```ts
interface RLEMatrixEncodingData {
    name?: string,
    rule?: string | number | LifeRuleData,
    comments?: string[],
    creationData?: string,
    topleft: [number, number]
    matrix: (0 | 1)[][],
}

interface RLECoordinateEncodingData {
    name?: string,
    rule?: string | number | LifeRuleData,
    comments?: string[],
    creationData?: string,
    liveCoordinates: [number, number][]
}
```

### Files - Querying

The format of a string can be explicitly tested with the function
**getLifeStringFormat**. **getLifeStringFormat** will either return "rle",
"life 1.05", "life 1.06", "plaintext", or "N/A". If **getLifeStringFormat**
returns "N/A", this means that the format of the rule string could not be
identified, and the given life string will throw an error if passed into
**readLifeString**. If **getLifeStringFormat** returns "rle", "life 1.05",
"life 1.06", or "plaintext", this is the file format detected by llcacodec and
will be used to parse the life string data **readLifeString**. However, just
because **getLifeStringFormat** does not return "N/A" does NOT mean that
**readLifeString** will not throw an error. There may be further internal
problems with the string data not yet detected, as **getLifeStringFormat** does
not necessarily read and validate the entire string before returning a format.
**getLifeStringFormat** simply detects what format the given string best
follows, whether that be from an available file header or a specific line in
the provided string unique to a certain format.

**isLifeStringFormat** will test if a provided life-like string meets a
provided format. The formats available are "rle", "life 1.06", "life 1.05", and
"plaintext". **isLifeStringFormat** returns true if the provided live-like
string meets a provided format's requirements. **isLifeStringFormat** returning
true when paired with a certain format does NOT mean that **readLifeString**
will not throw an error, as **isLifeStringFormat** is only required to test
against basic identifiers for a given format, such as present special lines or
a present file header.

### Files - Extra

> Dev Note: The interfaces for **readLifeString** and **writeLifeString** may
> not be exactly the same as seen in the source code of llcacodec.
> This is because the object structures shown here are specific to what
> **readLifeString** and **writeLifeString** will take, not
> what any intermediary implementation steps may be present in the actual
> source code.

---

## Rules

llcacodec supports 3 different rule formats for Life-Like Cellular Automata:
[B/S, S/B](https://conwaylife.com/wiki/Rulestring)
, and [Rule Integer](https://conwaylife.com/wiki/Rule_integer) notation

As an example, Conway's Game Of Life could be represented by "B3/S23", "23/3"
or 6152, where
"B3/S23" is in B/S notation, "23/3" is in S/B notation, and 6152 is in Rule
Integer notation.
All notations represent the same data: What numbers of neighbors must be alive
around a dead cell for that cell to come alive (B as in Birth) and what numbers
of neighbors must be alive around an alive cell for that cell to survive (S as
in Survival, hence, B/S and S/B).

All functions to read, write, and manipulate rules can be accessed by importing
from the ```js "llcacodec/rule"``` endpoint, which
consists of the functions **makeLifeRule**, **readLifeRule**,
**getLifeRuleFormat**, **isValidLifeRule**, and **convertLifeRule**

### Rules - Parsed Rule Data

Parsed rules are represented through the **LifeRuleData** object. A
**LifeRuleData** object is any object with the keys **"birth"** and
**"survival"**, where both **"birth"** and **"survial"** are arrays of unique
integers from 0 to 8 which detail the numbers of allowed neighbors for a dead
cell to come alive and the numbers of allowed neighbors for a live cell cell to
survive to the next generation. Both **"birth"** and **"survival"** keys will
MUST be arrays with no duplicates, or else the **LifeRuleData** object is
invalid and the function **isValidLifeRuleData** will return false.

### Rules - Creating Rules

Rules can be created with the **makeLifeRule** function, which takes in a
**LifeRuleData** object containing the parsed Life-Like rule data. The
structure of this **LifeRuleData** object can be found directly above this
paragraph. If the arrays provided to the **"birth"** and **"survival"** keys of
the **LifeRuleData** object do not have completely unique entries or have
values which are not integers ranging from 0 to 8, **makeLifeRule** will throw
an error. The validity of this object can be checked with the function
**isValidLifeRuleData** before calling **makeLifeRule**. if
**isValidLifeRuleData** returns true with a given **LifeRuleData** object,
**makeLifeRule** will NOT throw an error when called with that same
**LifeRuleData** object.

### Rules - Reading Rules

Rules can be read with the **readLifeRule** function, which takes in a string
in either [B/S notation or S/B notation](https://conwaylife.com/wiki/Rulestring),
or a number in [Rule Integer notation](https://conwaylife.com/wiki/Rule_integer).
**readLifeRule** returns a **LifeRuleData** object as detailed above.
**readLifeRule** WILL throw an error if the provided life rule's data cannot be read.
However, **readLifeRule** will NOT throw an error if **isValidLifeRule** returns true
when **isValidLifeRule** is provided with the same given rule. Therefore, if the
origin of the given rule is unknown or may be invalid, users should always assert
a rule's validity with **isValidLifeRule** before calling **readLifeRule**.
Alternatively, the user could catch errors in a try/catch block, or catch errors
in a Promise's .catch function if the call to **readLifeRule** is within
Promise's callback function.

### Rules - Getting Rule Formats

If the format of a rule is unknown, the function **getLifeRuleFormat** will
return the format of a given rule. **getLifeRuleFormat** takes in one argument,
which is the life rule to find the format of. This function will return the
strings "b/s", "s/b", or "int", where "b/s" is returned if the format of the
provided string is in B/S notation, "s/b" is returned if the format of the
provided string is in S/B notation, and "int" is returned if the format of the
provided string is in Rule Integer notation. If any error occurs, this function
will not throw an error but will instead return the string "N/A", which
dictates that no matching format could be found.

### Rules - Validating Rules

Rules can be validated by the **isValidLifeRule** function, which takes in a
string or number that will be validated to be a life rule or not.
The provided string or number is validated if it's formatted in
[B/S, S/B](https://conwaylife.com/wiki/Rulestring), or
[Rule Integer notation](https://conwaylife.com/wiki/Rule_integer).
**isValidLifeRule** is recommended to be checked before using the functions **readLifeRule** and
**convertLifeRule**, as they both will throw errors if the provided rule is not
valid. If **isValidLifeRule** returns true for a provided rule, then it is
guaranteed that **readLifeRule** and **convertLifeRule** will not throw errors.
Optionally, **isValidLifeRule** can also take a second argument of which format
to validate against. This second argument can ONLY be of the values "b/s",
"s/b" and "int". If the second argument is present, the function
**isValidLifeRule** will only return true if the provided rule fits the
provided format. If the provided rule does not fit the provided format,
**isValidLifeRule** will return false even if the rule fits another format.

### Rules - Converting Rules

Rules can be converted from one format to another with the function
**convertLifeRule**. **convertLifeRule** takes in two required values: the rule
to be converted and the format to convert the rule to. **convertLifeRule** then
returns the provided rule in the provided format. The provided rule must be a
validly formatted as [B/S, S/B](https://conwaylife.com/wiki/Rulestring), or
[Rule Integer](https://conwaylife.com/wiki/Rule_integer) notation. The second
argument must be of the values "b/s", "s/b", or "int", where each string
denotes the target format of the returned converted rule. The validity of the
provided life rule can and should be checked with the **isValidLifeRule**
function before use of **convertLifeRule**. If the life rule is invalud,
**convertLifeRule** will throw an error. If the provided rule is already in the
provided format, **convertLifeRule** will simply return the provided rule in
the same format as before.

---

## FAQ (not really, but I suspect so)

- How can I get live cell coordinates from a string

```ts
// btw, plain pattern strings of asterisks and periods can also be read. 
Asterisks are live cells and periods are dead cells
// This example data serves as just that, but usually data would be loaded as a 
string from an actual file.
const example_data =    "*****...*\n" +
                        "...****..\n" +
                        "...***.*.\n" +
                        "..**.....\n" +
                        "...**.**.\n";

const coordinates: [number, number][] = 
readLifeString(example_data).liveCoordinates
// do stuff with your new found data
```

- Can I use llcacodecjs with CommonJS modules

Currently, no. It's coming, but not yet, as the API itself is not even stable,
and I see that as more important

- How can I get my file data from my file formats

On browser, the preferred format would probably be using the fetch API to fetch
static files in a webpage or files from servers.  
Alternatively, one could capture the onChange event
of an ```html <input type="file">``` DOM element and read from
the target.files property of the returned event  
More information about fetching from the local filesystem from the browser:  
[File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)  
[File And Directory Entries API](https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API)

```js
// Using promises
import { readLifeString, isValidLifeString } from "llcacodecjs"

fetch("my/path")
.then(res => res.text())
.then(str => readLifeString(str))
.then(data => console.log("Do something with this data", data));
.error(err => console.error("Do something with this error"))

```

```js
// using an async function
import { readLifeString } from "llcacodecjs"

async function fetchLifeLikeFileData(pathOrURL) {
    const textFile = await fetch(pathOrURL).then(res => res.text())
    const data = readLifeString(textFile)
    return data;
}

fetchLifeLikeFileData("my/path")
.then(data => console.log("Do something with this data", data))
```

Similarly, in node.js, the fs/promises module could be used to fetch files from
the disk

```js
//through promises
import fs from "fs/promises"

fs.readFileAsync("my/path")
.then(buffer => readLifeString(buffer.toString()))
.then(data => console.log("Do something with this data", data))
.catch(err => console.error(error))

fs.readFileAsync("my/path")
.then(buffer => buffer.toString())
.then(data => console.log("Do something with this data", data))
.catch(err => console.error(error))
```

```js
// using an async function
import fs from "fs/promises"

async function fetchLifeLikeFileData(pathOrURL) {
    const textFile = await fs.readFileAsync(pathOrURL).then(buffer => 
buffer.toString())
    const data = readLifeString(textFile)
    return data;
}

fetchLifeLikeFileData("my/path")
.then(data => console.log("Do something with this data", data))
.error(err => console.error("Do something on error", err))
```

---

Written for llcacodec version 0.1.5
Written by [cobyj33](https://www.github.com/cobyj33)
