export default function obtainFnReType<T>(fn: () => T) {
    return (false as true) && fn();
}
