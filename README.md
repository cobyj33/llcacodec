# llcacodec

![llacodec logo](assets/logo/llcacodec_logo_112x112.png)

**L**ife-**L**ike **C**ellular **A**utomata **Codec**

Decoding and Encoding of Life-Like Cellular Automata Data Files in Node js
and the browser

```npm install --save-exact llcacodec```

> **NOTE**: llcacodec is currently in pre-release testing, which means that there may be many unaccounted bugs and
> unpredicted behaviors present, as well as that the API is subject to change at any time.
> **It is currently recommended to install the package using --save-exact with npm.**

[DOCUMENTATION.md:](DOCUMENTATION.md)
Documentation, Quickstart, and Supported File and Rule Formats  
[PATTENRS.md:](PATTERNS.md)
Links to downloads for Life-Like pattern collections  

## Demonstration

llcacodec has 4 main features:
- Reading Life-Like Cellular Automata Files
- Writing Life-Like Cellular Automata Files
- Reading Life-Like Cellular Automata Rules
- Writing Life-Like Cellular Automata Rules

## Reading Files

Let's say we have a Life Like Pattern File:

```txt
#N 2-engine Cordership
#O Aidan F. Pierce
#C The smallest known Cordership.
#C https://conwaylife.com/wiki/2-engine_Cordership
x = 41, y = 49, rule = B3/S23
19b2o$19b4o$19bob2o2$20bo$19b2o$19b3o$21bo$33b2o$33b2o7$36bo$35b2o$34b
o3bo$35b2o2bo$40bo$37bobo$38bo$38bo$38b2o$38b2o3$13bo10bo$12b5o5bob2o
11bo$11bo10bo3bo9bo$12b2o8b3obo9b2o$13b2o9b2o12bo$2o13bo21b3o$2o35b3o
7$8b2o$8b2o11b2o$19b2o2bo$24bo3bo$18bo5bo3bo$19bo2b2o3bobo$20b3o5bo$
28bo!
```

> This example file, 2enginecordership.rle, along with many
> other Game of Life and Life Like Cellular Automata
> files, could be found at the
> [conway life wiki pattern index](https://conwaylife.com/patterns/)

Our file is represented in [RLE](https://conwaylife.com/wiki/Run_Length_Encoded)
format, and defines multiple sections of metadata as well as the actual pattern
data. Just upon inspection, we can see

- The pattern's name is ```2-engine Cordership```, as shown by the #N line
- The pattern was created by ```Aidan F. Pierce```, as shown by the #O line
- The pattern has 2 comments:
  - ```The smallest known Cordership.```
  - ```https://conwaylife.com/wiki/2-engine_Cordership```
- The pattern has a width of 41 and a height of 49,
  as shown by ```x = 41, y = 49```
- The pattern has the Life-Like Automata rule of "B3/S23" as shown by
  ```rule = B3/S23``` which is the standard Conway's game of life rule.

We also see a Run-Length Encoded block of data under the metadata area, the
configuration of all live and dead cells are shown. If we want to parse all of
this data, we simply need to use the **readLifeString** function provided by
llcacodec.

```js
import { readLifeString } from "llcacodec"
readLifeString(/* String data here */)
```

Upon calling **readLifeString** with our string of the file data,
we get this object.

```js
{
  format: 'rle',
  comments: [
    'The smallest known Cordership.',
    'https://conwaylife.com/wiki/2-engine_Cordership'
  ],
  name: '2-engine Cordership',
  creationData: 'Aidan F. Pierce',
  topleft: null,
  width: 41,
  height: 49,
  ruleString: 'B3/S23',
  rule: { birth: [ 3 ], survival: [ 2, 3 ] },
  liveCoordinates: [
    [ 19, 0 ],   [ 20, 0 ],   [ 19, -1 ],  [ 20, -1 ],  [ 21, -1 ],
    [ 22, -1 ],  [ 19, -2 ],  [ 21, -2 ],  [ 22, -2 ],  [ 20, -4 ],
    [ 19, -5 ],  [ 20, -5 ],  [ 19, -6 ],  [ 20, -6 ],  [ 21, -6 ],
    /** ... truncated for the sake of the readme's size */
  ],
  hashLines: [
    {
      content: '2-engine Cordership',
      id: 'N',
      full: '#N 2-engine Cordership'
    },
    { content: 'Aidan F. Pierce', id: 'O', full: '#O Aidan F. Pierce' },
    {
      content: 'The smallest known Cordership.',
      id: 'C',
      full: '#C The smallest known Cordership.'
    },
    {
      content: 'https://conwaylife.com/wiki/2-engine_Cordership',
      id: 'C',
      full: '#C https://conwaylife.com/wiki/2-engine_Cordership'
    }
  ]
}
```

As you can see, we have an object with all of the necessary data from the file
that we listed, including the name, comments, creation metadata, rule, width,
height, and live coordinates. llcacodec is made with the idea of being simple,
a function call should be all that's necessary to get all data in a parsed
and manipulatable format.

However, the format of the data will change with different formats of the
Life-Like Cellular Automata file, as different file formats return different
forms of data. For example, this file, ```16cell47487m.cells```, is in the
plaintext data format.

```txt
! 16cell47487m.cells
! 16-cell variant of 47575M, originally found by Adam P. Goucher,
!   optimized by Tanner Jacobi and Aidan F. Pierce.
! https://conwaylife.com/wiki/47575M
! https://www.conwaylife.com/patterns/16cell47487m.cells
...................OOO
....................O.
......O...............
......O...............
......O...............
......................
......................
......................
......................
......................
......................
......................
...........O..........
O..........OO.........
O.....................
O.O...................
.OO...................
```

In this case, upon a call to **readLifeString** we get
an object with this format:

```js
{
  format: 'plaintext',
  name: '16cell47487m.cells',
  description: [
    '16-cell variant of 47575M, originally found by Adam P. Goucher,',
    'optimized by Tanner Jacobi and Aidan F. Pierce.',
    'https://conwaylife.com/wiki/47575M',
    'https://www.conwaylife.com/patterns/16cell47487m.cells'
  ],
  matrix: [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 ],
    [ 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    /** ... truncated for the sake of the readme's size */
  ],
  liveCoordinates: [
    [ 19, -0 ],  [ 20, -0 ], [ 21, -0 ],  [ 20, -1 ], [ 6, -2 ],   [ 6, -3 ],
    [ 6, -4 ],   [ 11, -12 ], [ 0, -13 ],  [ 11, -13 ], [ 12, -13 ],
    [ 0, -14 ], [ 0, -15 ],  [ 2, -15 ], [ 1, -16 ],  [ 2, -16 ]
  ]
}
```

As you can see, the returned object differs in structure based on the format.
However, there is only a single format for the returned data for each Life-Like
format. Therefore, we could determine the structure of the data by simply
checking the **format** field of the returned data. Each data is required to
have a **format** and **liveCoordinates** field as well, so the
parsed simulation data could be used without determining the data's
structure.

The parsed object structure for each format can be found
[here](DOCUMENTATION.md#files---reading) in llcacodec's documentation

## Reading Rules

Similarly, llcacodec has the power to take in Life-Like rules on their own.
For example, if we had the rule ```B45/S34```, we could use the **readLifeRule**
function to get data on the amount of live neighbors for survival and birth for
a cell in Life Like Cellular Automata:

```js
import { readLifeRule } from "llcacodec"
readLifeRule("B45/S34")
```

and we recieve the object

```js
{
    birth: [4, 5],
    survival: [3, 4]
}
```

where "birth" returns the allowed number of live cells necessary around a dead
cell for that dead cell to be born, and "survival" represents the allowed number
of live cells around a live cell for that live cell to stay alive.

---

Specific data on the behaviors, return types, and parameters of llcacodec
functions and API can be found at [DOCUMENTATION.md](DOCUMENTATION.md)  

---

## Gallery

Some pretty examples of patterns loaded by llcacodec

![sawtooth](assets/readme/sawtooth.gif)
![max](assets/readme/max.gif)
![ships](assets/readme/ships.gif)
![dendrite](assets/readme/dendrite.gif)
