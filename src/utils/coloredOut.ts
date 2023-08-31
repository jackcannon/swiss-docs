export const coloredOut = {
  HEADER: (str: string) => `\u001b[97m\u001b[2m${str}\u001b[22m\u001b[39m`,
  PACKAGENAME: (str: string) => `\u001b[97m\u001b[1m${str}\u001b[22m\u001b[39m`,
  PROPNAME: (str: string) => `\u001b[37m\u001b[2m${str}\u001b[22m\u001b[39m`,
  REGULARVALUE: (str: string) => `\u001b[37m${str}\u001b[39m`,
  NONE: (str: string) => `\u001b[90m\u001b[2m${str}\u001b[22m\u001b[39m`,
  GREEN: (str: string) => `\u001b[32m${str}\u001b[39m`,
  RED: (str: string) => `\u001b[31m${str}\u001b[39m`,
  YELLOW: (str: string) => `\u001b[33m${str}\u001b[39m`,
  BOLD: (str: string) => `\u001b[1m${str}\u001b[22m`
};
