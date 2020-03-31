
const baseUrl = (process.env.NODE_ENV === 'production'
    ? 'https://min-madplan.herokuapp.com/'
    : 'http://localhost:1337/');
export const absUrl = (url) => `${baseUrl}${url}`;