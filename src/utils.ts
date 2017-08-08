/**
 * @license Utils
 * (c) 2017 Amin Paks <amin.pakseresht@hotmail.com>
 * License: MIT
 */
export function isNil(value: any): boolean {
  return (value === undefined) || (typeof value === 'undefined') || (value === null);
}

export function isNumber(value: any): boolean {
  return (typeof value === 'number');
}

export function isArray(value: any): boolean {
  return (value instanceof Array);
}

export function isString(value: any): boolean {
  return (typeof value === 'string');
}

export function parseNumber(value: string): number | undefined {
  const match = /(\d+(\.\d+)?)/.exec(value);
  if (!isNil(match)) {
    return parseFloat(match[0]);
  }
  return undefined;
}
