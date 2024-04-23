import type {
	AxiosRequestConfig,
	AxiosInstance,
	AxiosResponse,
	AxiosError,
} from 'axios';
import type { RequestOptions } from './interface';
import type { AxiosResponseAgent, CreateAxiosOptions } from './axios-transform';
import axios from 'axios';
import qs from 'qs';
import { AxiosCanceler } from './axios-cancel';
import { isFunction } from '@quantum-design/utils';
import { cloneDeep, omit } from 'lodash-es';
import { gRequestEnum, gContentTypeEnum } from '@quantum-design/shared/enums';
import { joinEnvToUrl } from './helper';

export * from './axios-transform';

/**
 * @description:  axios模块
 */
export class VAxios {
	private axiosInstance: AxiosInstance;
	private readonly options: CreateAxiosOptions;

	constructor(options: CreateAxiosOptions) {
		this.options = { ...options };
		this.axiosInstance = axios.create(options);
		this.setupInterceptors();
	}

	/**
	 * @description:  Create axios instance
	 */
	private createAxios(config: CreateAxiosOptions): void {
		this.axiosInstance = axios.create(config);
	}

	private getTransform() {
		const { defaultTransform } = this.options;
		return {
			...defaultTransform,
		};
	}

	getAxios(): AxiosInstance {
		return this.axiosInstance;
	}

	/**
	 * @description: Reconfigure axios
	 */
	configAxios(config: CreateAxiosOptions) {
		if (!this.axiosInstance) {
			return;
		}
		this.createAxios(config);
	}

	/**
	 * @description: Set general header
	 */
	setHeader(headers: any): void {
		if (!this.axiosInstance) {
			return;
		}
		Object.assign(this.axiosInstance.defaults.headers, headers);
	}

	/**
	 * @description: Interceptor configuration
	 */
	private setupInterceptors() {
		const transform = this.getTransform();
		if (!transform) {
			return;
		}
		const {
			requestInterceptors,
			requestInterceptorsCatch,
			responseInterceptors,
			responseInterceptorsCatch,
		} = transform;

		const axiosCanceler = new AxiosCanceler();
		// Request interceptor configuration processing
		this.axiosInstance.interceptors.request.use(
			(config: CreateAxiosOptions) => {
				// If cancel repeat request is turned on, then cancel repeat request is prohibited

				const { cancelToken } = config.requestOptions!;

				const ignoreRepeat =
					cancelToken !== undefined
						? cancelToken
						: this.options.requestOptions?.cancelToken;
				ignoreRepeat && axiosCanceler.addPending(config);
				if (
					requestInterceptors &&
					isFunction(requestInterceptors)
				) {
					config = requestInterceptors(
						config as SelectPartial<
							AxiosRequestConfig,
							'url' | 'headers' | 'method'
						>,
						this.options
					);
				}
				return config;
			},
			undefined
		);

		// Request interceptor error capture
		requestInterceptorsCatch &&
			isFunction(requestInterceptorsCatch) &&
			this.axiosInstance.interceptors.request.use(undefined, (error) => {
				requestInterceptorsCatch(error, this.options);
			});

		// Response result interceptor processing
		this.axiosInstance.interceptors.response.use(
			(res: AxiosResponse<any>) => {
				res && axiosCanceler.removePending(res.config);
				if (
					responseInterceptors &&
					isFunction(responseInterceptors)
				) {
					res = responseInterceptors(
						res as AxiosResponseAgent<any>,
						this.options
					);
				}
				return res;
			},
			undefined
		);

		// Response result interceptor error capture
		responseInterceptorsCatch &&
			isFunction(responseInterceptorsCatch) &&
			this.axiosInstance.interceptors.response.use(undefined, (error) => {
				responseInterceptorsCatch(
					error,
					this.options,
					this.axiosInstance
				);
			});
	}

	/**
	 * @description:  上传文件
	 */
	uploadFile<T = any>(config: AxiosRequestConfig, params: UploadFileParams) {
		const formData = new window.FormData();
		if (params.data) {
			Object.keys(params.data).forEach((key) => {
				if (!params.data) return;
				const value = params.data[key];
				if (Array.isArray(value)) {
					value.forEach((item) => {
						formData.append(`${key}[]`, item);
					});
					return;
				}

				formData.append(key, params.data[key]);
			});
		}
		formData.append(params.name || 'file', params.file, params.filename);
		const customParams = omit(params, 'file', 'filename', 'file');

		Object.keys(customParams).forEach((key) => {
			formData.append(key, customParams[key]);
		});

		const uploadUrl = this.options.requestOptions?.uploadUrl
			? this.options.requestOptions?.uploadUrl
			: '';
		const url =
			uploadUrl +
			'' +
			config.url +
			`?${joinEnvToUrl(
				this.options.requestOptions?.env || (() => ''),
				true
			)}`;

		const opt: RequestOptions = Object.assign(
			{},
			this.options.requestOptions || {},
			{
				cancelToken: false,
			}
		);

		const _option: CreateAxiosOptions = {
			...config,
			method: 'POST',
			data: formData,
			url: url,
			// url: config.url! + '?' + `${joinTimestamp(this.options.requestOptions?.joinEnv ?? true, true)}&` + `${joinEnvToUrl(this.options.requestOptions?.joinEnv ?? true, true)}`,
			headers: {
				'Content-type': gContentTypeEnum.FORM_DATA,
			},
			requestOptions: opt,
		};
		return this.axiosInstance.request<T>(_option);
	}

	// 格式化请求参数
	supportFormData(config: AxiosRequestConfig) {
		const headers = config.headers || this.options.headers;
		const contentType =
			headers?.['Content-Type'] || headers?.['content-type'];

		if (
			contentType !== gContentTypeEnum.FORM_URLENCODED ||
			!Reflect.has(config, 'data') ||
			config.method?.toUpperCase() === gRequestEnum.GET
		) {
			return config;
		}

		return {
			...config,
			data: qs.stringify(config.data),
		};
	}

	get<T = any>(
		config: AxiosRequestConfig,
		options?: RequestOptions
	): Promise<T> {
		return this.request({ ...config, method: 'GET' }, options);
	}

	post<T = any>(
		config: AxiosRequestConfig,
		options?: RequestOptions
	): Promise<T> {
		return this.request({ ...config, method: 'POST' }, options);
	}

	put<T = any>(
		config: AxiosRequestConfig,
		options?: RequestOptions
	): Promise<T> {
		return this.request({ ...config, method: 'PUT' }, options);
	}

	delete<T = any>(
		config: AxiosRequestConfig,
		options?: RequestOptions
	): Promise<T> {
		return this.request({ ...config, method: 'DELETE' }, options);
	}

	request<T = any>(
		config: AxiosRequestConfig,
		options?: RequestOptions
	): Promise<T> {
		let conf: CreateAxiosOptions = cloneDeep(config);
		const transform = this.getTransform();

		const { requestOptions } = this.options;

		const opt: RequestOptions = Object.assign({}, requestOptions, options);

		const { beforeRequestHook } = transform || {};
		if (beforeRequestHook && isFunction(beforeRequestHook)) {
			conf = beforeRequestHook(conf, opt);
		}

		conf.requestOptions = opt;

		conf = this.supportFormData(conf);

		return new Promise((resolve) => {
			this.axiosInstance
				.request<any, AxiosResponse<Result>>(conf)
				.then((res: AxiosResponse<Result>) => {
					try {
						if (opt?.isReturnNativeResponse) {
							resolve(res as unknown as Promise<T>);
						}
						if (res && res.data) {
							resolve(res.data as unknown as Promise<T>);
						}
					} catch (err) {
						console.log(err || '请求取消');
					}
					return;
				})
				.catch((e: Error | AxiosError) => {
					console.log(e || '请求取消');
				});
		});
	}
}
