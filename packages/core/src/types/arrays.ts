// TODO: How to get this allowing infinite depth?
// https://github.com/JoshuaKGoldberg/flint/issues/182
export type AnyLevelDeep<T> = AnyLevelDeep<T>[] | T;
