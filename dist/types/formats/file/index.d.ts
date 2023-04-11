import { Life106DecodedData, Life106EncodingData } from "./life106";
import { PlaintextDecodedData, PlaintextMatrixEncodingData, PlaintextCoordinateEncodingData } from "./plaintext";
import { RLECoordinateEncodingData, RLEDecodedData, RLEMatrixEncodingData } from "./rle";
import { Life105DecodedData } from "./life105";
export type SupportedLifeLikeReadFileFormats = "life 1.06" | "life 1.05" | "plaintext" | "rle";
export type SupportedLifeLikeWriteFileFormats = "life 1.06" | "plaintext" | "rle";
/**
 * Read a life string
 *
 * A life string can be in either one of these formats.
 *
 * [Life 1.05](https://conwaylife.com/wiki/Life_1.05):
 * represented by the string "life 1.05"
 *
 * [Life 1.06](https://conwaylife.com/wiki/Life_1.06):
 * represented by the string "life 1.06"
 *
 * [Plaintext](https://conwaylife.com/wiki/Plaintext):
 * represented by the string "plaintext"
 *
 * [Run-Length Encoded (RLE)](https://conwaylife.com/wiki/Run_Length_Encoded).
 * represented by the string "rle"
 *
 * @note Usually these files are generated by a Life-Like program, such as Golly or XLife,
 * or by a library such as llcacodec. However, they can be written by hand if you so please.
 *
 * The output of the given data object is based on which one of the formats is parsed. However, all returned data
 * is guaranteed to have 2 keys: "format" and "liveCoordinates".
 *
 * The parsed format can be found with the "format" key,
 * which will either have a value of "plaintext", "life 1.06", "life 1.05", or "rle" corresponding with the given life string's format.
 * The layout of the parsed data can then be determined by finding the value of the "format" key.
 *
 * "liveCoordinates" will be a 2D vector array in [x, y] format where each entry represents a live cell.
 * x and y are guaranteed to be integers.
 * x is positive to the right and negative approaching the left, and y is positive approaching north and
 * negative approaching south. This may be good to take note of if your program assumes that positive
 * y approaches south, such as in a "row" and "column" layout.
 *
 * The particulars of each data format is out of the scope of this little docstring,
 * and can be found in DOCUMENTATION.md in the llcacodec repository. This documentation
 * could also be found online [here](https://www.github.com/cobyj33/llcacodec/blob/master/DOCUMENTATION.md)
 *
 * @param data The life string to parse for data
 * @param format Optional parameter. Defaults to "" if no parameter is passed. This is the format
 * used by readLifeString to parse the data. format can equal either "life 1.06", "life 1.05",
 * "plaintext", "rle", or "". If format equals "", then readLifeString will attempt to detect
 * the format of the provided data. If undefined is passed, an error is thrown
 *
 * @throws 1. If there is an error parsing the given life string in a given format.
 * 2. If there is an error finding the life string's format.
 * 3. If the passed format is undefined.
 */
export declare function readLifeString(data: string, format: "plaintext"): PlaintextDecodedData;
export declare function readLifeString(data: string, format: "life 1.06"): Life106DecodedData;
export declare function readLifeString(data: string, format: "rle"): RLEDecodedData;
export declare function readLifeString(data: string, format: "life 1.05"): Life105DecodedData;
export declare function readLifeString(data: string): Life106DecodedData | PlaintextDecodedData | RLEDecodedData | Life105DecodedData;
/**
 * Assert whether a life string conforms to a given format
 *
 * Note that just because isLifeStringFormat returns true does NOT mean that readLifeString will not throw an error when called with the given life string.
 * isLifeStringFormat does not confirm if the passed data is valid. It only tries to detect if the given life string
 * conforms to a format by searching for required headers and sequences in the string.
 *
 * @param data The life string to test
 * @param format The format to test conformity against the given life string with.
 * Can either be "plaintext", "life 1.05", "life 1.06", or "plaintext"
 * @returns Whether the given life string conforms with the given format
 */
export declare function isLifeStringFormat(data: string, format: SupportedLifeLikeReadFileFormats): boolean;
/** Detect the format of a life string
 *
 * Note that just because getLifeStringFormat detects a file format does NOT mean that readLifeString will not throw an error
 * when called with the given life string. getLifeStringFormat does not confirm if the passed data is valid.
 * It only tries to detect the given life string's format by searching for required headers and sequences in the string.
 *
 * @param data The life string to get the format of
 * @returns Either "life 1.06", "life 1.05", "rle", or "plaintext" on the finding
 * of a successful format, and an empty string when no format could be found.
 */
export declare function getLifeStringFormat(data: string): SupportedLifeLikeReadFileFormats | "";
export type FileFormatEncodingData = (Life106EncodingData & {
    format: "life 1.06";
}) | (PlaintextMatrixEncodingData & {
    format: "plaintext";
}) | (PlaintextCoordinateEncodingData & {
    format: "plaintext";
}) | (RLEMatrixEncodingData & {
    format: "rle";
}) | (RLECoordinateEncodingData & {
    format: "rle";
});
/**
 * Write a Life String, keeping the passed data in a portable string format
 *
 * writeLifeString can write in either one of these formats:
 *
 * [Life 1.06](https://conwaylife.com/wiki/Life_1.06):
 * represented by the presence of { format: "life 1.06" } in the given structured data
 *
 * [Plaintext](https://conwaylife.com/wiki/Plaintext):
 * represented by the presence of { format: "plaintext" } in the given structured data
 *
 * [Run-Length Encoded (RLE)](https://conwaylife.com/wiki/Run_Length_Encoded):
 * represented by the presence of { format: "rle" } in the given structured data
 *
 * Given all of these formats, rle will likely be the most compressed and desired
 * format the large majority of the time. Generally, it is much better to represent
 * any semi-large or large pattern, but it is less straight-forward for humans to read
 * if that is desired.
 *
 * Plaintext will be a little larger, but should generally not be used for patterns with a bounding box with a width
 * greater than 80 cells. Plaintext, however, could be desired for smaller patterns because of
 * the human-readability of the pattern's diagram.
 *
 * Life 1.06 is also viable for smaller patterns. However, since Life 1.06 lists every single
 * coordinate without any compression, Life 1.06 could make for larger files as well.
 *
 * The particulars of each data format is out of the scope of this little docstring,
 * and can be found in DOCUMENTATION.md in the llcacodec repository. This documentation
 * could also be found online [here](https://www.github.com/cobyj33/llcacodec/blob/master/DOCUMENTATION.md)
 *
 * @param data The structured data to use when creating the life string
 * @returns A life string containing the passed in compiled data.
 */
export declare function writeLifeString(data: FileFormatEncodingData): string;
declare const _default: {
    readLifeString: typeof readLifeString;
    writeLifeString: typeof writeLifeString;
    isLifeStringFormat: typeof isLifeStringFormat;
    getLifeStringFormat: typeof getLifeStringFormat;
};
export default _default;
//# sourceMappingURL=index.d.ts.map