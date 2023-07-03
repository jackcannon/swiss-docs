export const warn = (message: string) => {
  const WARN_ANSI_START = '\u001b[33m\u001b[1m';
  const WARN_ANSI_END = '\u001b[22m\u001b[39m';
  console.warn(`${WARN_ANSI_START}${message}${WARN_ANSI_END}`);
};
