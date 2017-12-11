import request from 'request-promise';

export default async (options) => {
    let jar = request.jar();
    let cookie = request.cookie(`${options.setCookie.name}=${options.cookie || options.setCookie.value}`);
    let url = options.setCookie.domain;

    jar.setCookie(cookie, url);

    return await request(Object.assign({}, options, {jar}));
};
