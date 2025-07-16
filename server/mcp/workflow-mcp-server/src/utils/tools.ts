// 生成 uuid
export function generateUUID(len: number, radix?: number) {
    const _chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const _uuid:string[] = [];
    let i;
    radix = radix || _chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) _uuid[i] = _chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        let r;

        // rfc4122 requires these characters
        _uuid[8] = _uuid[13] = _uuid[18] = _uuid[23] = '-';
        _uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!_uuid[i]) {
                r = 0 | Math.random() * 16;
                _uuid[i] = _chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return _uuid.join('');
}

export const Logger = {
    log: (...args: any[]) => {
        console.log(...args);
    },
    error: (...args: any[]) => {
        console.error(...args);
    },
};

export function formatErrorMessage(error: any): string {
    if (error instanceof Error) {
        return error.message;
    } else if (typeof error === 'string') {
        return error;
    } else if (error && typeof error === 'object') {
        try {
        // 处理包含apiError字段的FeishuError对象
            if (error.apiError) {
                const apiError = error.apiError;
                let errorMsg = '';

                // 处理标准飞书API错误格式
                if (apiError.code && apiError.msg) {
                    errorMsg = `${apiError.msg} (错误码: ${apiError.code})`;

                    // 添加字段验证错误信息
                    if (apiError.error && apiError.error.field_violations && apiError.error.field_violations.length > 0) {
                        const violations = apiError.error.field_violations;
                        errorMsg += '\n字段验证错误:';
                        violations.forEach((violation: any) => {
                            let detail = `\n - ${violation.field}`;
                            if (violation.description) {
                                detail += `: ${violation.description}`;
                            }
                            if (violation.value) {
                                detail += `，提供的值: ${violation.value}`;
                            }
                            errorMsg += detail;
                        });

                        // 添加排查建议链接
                        if (apiError.error.troubleshooter) {
                            errorMsg += `\n\n${apiError.error.troubleshooter}`;
                        }
                    }

                    return errorMsg;
                }

                // 如果apiError没有标准结构，尝试序列化
                return `API错误: ${JSON.stringify(apiError)}`;
            }

            // 处理飞书API特定的错误格式
            if (error.code && error.msg) {
                // 基本错误信息
                let errorMsg = `${error.msg} (错误码: ${error.code})`;

                // 如果有详细的验证错误信息
                if (error.error && error.error.field_violations && error.error.field_violations.length > 0) {
                    const violations = error.error.field_violations;
                    errorMsg += '\n字段验证错误:';
                    violations.forEach((violation: any) => {
                        let detail = `\n - ${violation.field}`;
                        if (violation.description) {
                            detail += `: ${violation.description}`;
                        }
                        if (violation.value) {
                            detail += `，提供的值: ${violation.value}`;
                        }
                        errorMsg += detail;
                    });

                    // 添加排查建议链接（如果有）
                    if (error.error.troubleshooter) {
                        errorMsg += `\n\n${error.error.troubleshooter}`;
                    }
                }
                return errorMsg;
            }

            // 处理 {status, err} 格式的错误
            if (error.status && error.err) {
                return `操作失败 (状态码: ${error.status}): ${error.err}`;
            }

            // 尝试提取API错误信息，通常在错误对象的message或error字段中
            if (error.message) {
                return error.message;
            } else if (error.error) {
                if (typeof error.error === 'string') {
                    return error.error;
                } else if (error.error.message) {
                    return error.error.message;
                } else if (error.error.field_violations) {
                    // 处理错误嵌套在error对象中的情况
                    const violations = error.error.field_violations;
                    let errorMsg = '字段验证错误:';
                    violations.forEach((violation: any) => {
                        let detail = `\n - ${violation.field}`;
                        if (violation.description) {
                            detail += `: ${violation.description}`;
                        }
                        if (violation.value) {
                            detail += `，提供的值: ${violation.value}`;
                        }
                        errorMsg += detail;
                    });
                    return errorMsg;
                }
            } else if (error.code || error.status) {
                // 处理HTTP错误或API错误码
                const code = error.code || error.status;
                const msg = error.statusText || error.msg || 'Unknown error';
                return `操作失败 (错误码: ${code}): ${msg}`;
            }

            // 如果上述都不符合，尝试将整个对象序列化（但移除敏感信息）
            const safeError = { ...error, };
            // 移除可能的敏感信息
            ['token', 'secret', 'password', 'key', 'credentials'].forEach(key => {
                if (key in safeError) delete safeError[key];
            });
            return `发生错误: ${JSON.stringify(safeError)}`;
        } catch (e) {
            console.error('Error formatting error message:', e);
            return '发生未知错误';
        }
    }
    return '发生未知错误';
}
