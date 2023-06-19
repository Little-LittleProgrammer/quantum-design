# 公共枚举

## dateEnum 时间格式化的枚举
::: details 点击查看内容
```ts
export enum gDateFormatEnum {
    dateTime = 'YYYY-MM-DD HH:mm:ss',
    date = 'YYYY-MM-DD'
}

```
:::

## httpEnum 枚举
::: details 点击查看内容
```ts
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

```
:::

## regEnum 正则枚举

::: details 点击查看内容
```ts
export const gRegEnum = {
    // 邮箱
    emailReg: /^(?!\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}(?<!\.)$/,
    // url地址
    urlReg: /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/,
    // 复杂密码（8-20，必须包含英文、数字和字符）
    pwdHardReg: /^(?=.*[\d])(?=.*[a-zA-Z])(?=.*[^a-zA-Z\d\s])(((?!\s).)+){8,20}$/
};

```
:::