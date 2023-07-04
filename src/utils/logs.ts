const WARN_ANSI_START = '\u001b[33m\u001b[1m';
const WARN_ANSI_END = '\u001b[22m\u001b[39m';
export const warn = (message: string) => {
  console.warn(`  ${WARN_ANSI_START}${message}${WARN_ANSI_END}`);
};

const SUCCESS_ANSI_START = '\u001b[32m\u001b[1m';
const SUCCESS_ANSI_END = '\u001b[22m\u001b[39m';
export const success = (message: string) => {
  console.log(`  ${SUCCESS_ANSI_START}${message}${SUCCESS_ANSI_END}`);
};
