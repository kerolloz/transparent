const Buffer = require("buffer").Buffer;

const parseBody = (res) => {
  return new Promise((resolve) => {
    let buffer;
    res.onData((chunk, isLast) => {
      const curBuf = Buffer.from(chunk);
      buffer = buffer
        ? Buffer.concat([buffer, curBuf])
        : isLast
        ? curBuf
        : Buffer.concat([curBuf]);
      if (isLast) {
        resolve(buffer.toString());
      }
    });
  });
};

module.exports = { parseBody };
