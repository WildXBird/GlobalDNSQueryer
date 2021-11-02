
type JSONValue = string | number | boolean



export type JSONable = {
    [str: string]: JSONValue | JSONable
} | JSONValue[] | JSONable[]