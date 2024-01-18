export function createHeader() {
  return {
    Accept: 'application/json, text/plain, */*',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/11' +
      Math.floor(Math.random() * 10) +
      '.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
  }
}
