/**
 * @description: Request result set
 */
export enum gResultEnum {
    SUCCESS = '200',
    NOTFOUND = '404',
    ERROR = '400',
    SERVERERROR = '500',
    RELOAD = '307',
    LOGIN = '401',
    TIMEOUT = '408',
    TYPE = 'success',
}

/**
 * @description: request method
 */
export enum gRequestEnum {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

/**
 * @description:  contentTyp
 */
export enum gContentTypeEnum {
    // json
    JSON = 'application/json;charset=UTF-8',
    // form-data qs
    FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
    // form-data  upload
    FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
