import { HandleEnum } from '../enums/enum';
import { useProjectSetting } from '../hooks/use-project-setting';
import { IProjectConfig } from '../type';

export function handler(event: HandleEnum, value: any): IProjectConfig {
    switch (event) {
        case HandleEnum.cache_alive_status:
            return {
                cacheTabsSetting: {
                    openKeepAlive: value
                }
            };
        case HandleEnum.cache_drag_status:
            return {
                cacheTabsSetting: {
                    canDrag: value
                }
            };
        case HandleEnum.cache_quick_status:
            return {
                cacheTabsSetting: {
                    showQuick: value
                }
            };
        case HandleEnum.cache_tabs_status:
            return {
                cacheTabsSetting: {
                    show: value
                }
            };
        case HandleEnum.cache_cache:
            return {
                cacheTabsSetting: {
                    cache: value
                }
            };
        case HandleEnum.func_aside_repeat_status: {
            return {
                func: {
                    asideRepeatClick: value
                }
            };
        }
        case HandleEnum.func_bread_status: {
            return {
                func: {
                    showBreadCrumb: value
                }
            };
        }
        case HandleEnum.func_reload_status: {
            return {
                func: {
                    showReloadButton: value
                }
            };
        }
        case HandleEnum.func_remove_http_status: {
            return {
                func: {
                    removeAllHttpPending: value
                }
            };
        }
        case HandleEnum.func_search_status: {
            return {
                func: {
                    showSearchButton: value
                }
            };
        }
        case HandleEnum.func_top_status: {
            return {
                func: {
                    showBackTop: value
                }
            };
        }
        case HandleEnum.theme_gray_status: {
            return {
                theme: {
                    grayMode: value
                }
            };
        }
        case HandleEnum.theme_mode_change: {
            return {
                theme: {
                    showDarkModeToggle: value
                }
            };
        }
        case HandleEnum.transition_page_loading: {
            return {
                transition: {
                    openPageLoading: value
                }
            };
        }
        case HandleEnum.transition_progress: {
            return {
                transition: {
                    openNProgress: value
                }
            };
        }
        case HandleEnum.transition_status: {
            return {
                transition: {
                    enable: value
                }
            };
        }
        default: {
            return {};
        }
    }
}

export function set_handler(event: HandleEnum, value: any) {
    const projectSetting = useProjectSetting();
    const config = handler(event, value);
    projectSetting.setRootSetting(config);
}
