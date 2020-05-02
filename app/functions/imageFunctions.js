

export const absUrl = (url) => `${process.env.BASE_URL || 'http://localhost:1337'}${url}`;

//Remove unallowed characters and make image name unique to avoid conflicts when saving file.
export const sanitizeImageName = (name) => `${name.replace(' ', '-')}_${new Date().getTime()}`;