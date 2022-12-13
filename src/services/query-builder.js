const createQueryBuilder = (params) => Object.keys(params).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');

export default createQueryBuilder;