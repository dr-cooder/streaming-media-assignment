const fs = require('fs');
const path = require('path');

const parseRange = (stats, range = 'bytes=0-') => {
  const positions = range.replace(/bytes=/, '').split('-');

  let start = parseInt(positions[0], 10);

  const total = stats.size;
  const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

  if (start > end) {
    start = end - 1;
  }

  const chunkSize = (end - start) + 1;

  return {
    start, end, total, chunkSize,
  };
};

const makeStream = (response, file, start, end) => {
  const stream = fs.createReadStream(file, { start, end });

  stream.on('open', () => {
    stream.pipe(response);
  });

  stream.on('error', (streamErr) => {
    response.end(streamErr);
  });

  return stream;
};

const loadMedia = (request, response, url, type) => {
  const file = path.resolve(__dirname, url);

  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    const { range } = request.headers;
    const {
      start, end, total, chunkSize,
    } = parseRange(stats, range);

    response.writeHead(206, {
      'Content-Range': `bytes  ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': type,
    });

    return makeStream(response, file, start, end);
  });
};

const getParty = (request, response) => {
  loadMedia(request, response, '../client/party.mp4', 'video/mp4');
};

const getBling = (request, response) => {
  loadMedia(request, response, '../client/bling.mp3', 'audio/mpeg');
};

const getBird = (request, response) => {
  loadMedia(request, response, '../client/bird.mp4', 'video/mp4');
};

module.exports = {
  getParty,
  getBling,
  getBird,
};
