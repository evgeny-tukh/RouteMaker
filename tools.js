class Request {
    static fetchJson (url, data) {
        return fetch (url, Request.buildRequest (url, data));
    }

    static fetchGet (url) {
        return fetch (url, Request.buildRequest (url, null, Request.methods.GET, Request.contentTypes.FORM));
    }

    static buildRequest (url, body, method, contentType) {
        if (!method) method = Request.methods.POST;
        if (!contentType) contentType = Request.contentTypes.JSON;

        if (contentType === Request.contentTypes.JSON) body = JSON.stringify (body);
    
        return {
            method: method,
            mode: Request.corsTypes.CORS,
            cache: Request.cacheModes.NO_CACHE,
            credentials: Request.credModes.SAME_ORG,
            headers: {
              'Content-Type': contentType,
            },
            redirect: Request.redirectModes.FOLLOW,
            referrerPolicy: Request.referrerPolicies.NO_REFERRER,
            body: body,
        };
    }
};

Request.methods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

Request.contentTypes = {
    JSON: 'application/json',
    FORM: 'application/x-www-form-urlencoded',
};

Request.corsTypes = {
    CORS: 'cors',
    NO_CORS: 'no-cors',
    SAME_ORG: 'same-origin',
};

Request.credModes = {
    INCLUDE: 'include',
    SAME_ORG: 'same-origin',
    OMIT: 'OMIT',
};

Request.cacheModes = {
    DEFAULT: 'default',
    NO_CACHE: 'no-cache',
    RELOAD: 'reload',
    FORCE_CACHE: 'force-cache',
    ONLY_IF_CACHED: 'only-if-cached',
};

Request.redirectModes = {
    MANUAL: 'manual',
    FOLLOW: 'follow',
    ERROR: 'error',
};

Request.referrerPolicies = {
    NO_REFERRER: 'no-referrer',
    CLIENT: 'client',
};

