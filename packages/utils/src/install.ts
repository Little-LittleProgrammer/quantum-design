type EventShim = {
    new (...args: any[]): {
        $props: {
            onClick?: (...args: any[]) => void;
        };
    };
};

export type WithInstall<T> = T & {
    install(app: App): void;
} & EventShim;

type App ={
    component: any,
    config: any
}

export type CustomComponent = { displayName?: string, name?: string };

export const component_with_install = <T extends CustomComponent>(component: T, alias?: string) => {
    const _c = component as Record<string, unknown>;
    _c.install = function(app: App) {
        const _compName = _c.displayName || _c.name;
        if (!_compName) return;
        app.component(_compName, component);
        if (alias) {
            app.config.globalProperties[alias] = component;
        }
    };
    return component as WithInstall<T>;
};
