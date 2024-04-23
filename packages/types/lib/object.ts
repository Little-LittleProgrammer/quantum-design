export type DeepRequired<T> = {
    [P in keyof T]-?: T[P] extends object
        ? DeepRequired<T[P]>
        : T[P];
};
