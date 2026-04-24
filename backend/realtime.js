let ioInstance = null;

const setIO = (io) => {
  ioInstance = io;
};

const emitRealtime = (event, payload = {}) => {
  if (!ioInstance) return;
  ioInstance.emit(event, { ...payload, at: new Date().toISOString() });
};

module.exports = { setIO, emitRealtime };
