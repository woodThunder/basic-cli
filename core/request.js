import https from 'https';

export function request(path, method, data) {
  const options = {
    hostname: 'www.kuaidi100.com',
    path, // '/query?type=yunda&postid=433085175760261',
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let rawData = '';
      res.setEncoding('utf8');
      // 当收到响应数据时触发。回调函数的参数是一个缓冲区对象，表示接收到的一部分数据。需要注意的是，data 事件可能会被触发多次，每次只发送一部分数据。
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}
