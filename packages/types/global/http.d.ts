// http
declare interface Result<T = any> {
    code: number;
    data: T;
    msg: string;
}

// multipart/form-data: upload file
declare interface UploadFileParams {
    // Other parameters
    data?: Record<string, any>;
    // File parameter interface field name
    name?: string;
    action?: string;
    // file name
    file: File | Blob;
    // file name
    filename?: string;
    [key: string]: any;
  }

