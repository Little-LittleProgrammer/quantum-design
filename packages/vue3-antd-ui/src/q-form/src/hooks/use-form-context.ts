import { inject, InjectionKey, provide, reactive, UnwrapRef, readonly as defineReadonly } from 'vue';

interface CreateContextOptions {
    readonly?: boolean;
    createProvider?: boolean;
    native?: boolean;
  }

  type ShallowUnwrap<T> = {
    [P in keyof T]: UnwrapRef<T[P]>;
  };

function createContext<T>(
    context: any,
    key: InjectionKey<T> = Symbol(),
    options: CreateContextOptions = {}
) {
    const { readonly = true, createProvider = false, native = false } = options;

    const state = reactive(context);
    const provideData = readonly ? defineReadonly(state) : state;
    !createProvider && provide(key, native ? context : provideData);

    return {
        state
    };
}

function useContext<T>(
    key: InjectionKey<T> = Symbol(),
    defaultValue?: any
): ShallowUnwrap<T> {
    return inject(key, defaultValue || {});
}

export interface FormContextProps {
    resetAction: () => Promise<void>;
    submitAction: () => Promise<void>;
}
const key: InjectionKey<FormContextProps> = Symbol();

export function create_form_context(context: FormContextProps) {
    return createContext<FormContextProps>(context, key);
}

export function use_form_context() {
    return useContext<FormContextProps>(key);
}
