/* eslint-disable no-restricted-syntax */
function isEqual(lhs: object, rhs: object): boolean {
    if (lhs === rhs) return true;

    if (
        typeof lhs !== 'object'
        || typeof rhs !== 'object'
        || lhs === null
        || rhs === null
    ) return false;

    const keysLhs = Object.keys(lhs);
    const keysRhs = Object.keys(rhs);

    if (keysLhs.length !== keysRhs.length) return false;

    for (const key of keysLhs) {
        if (!keysRhs.includes(key)) return false;

        const vA = (lhs as any)[key];
        const vB = (rhs as any)[key];

        if (!isEqual(vA, vB)) return false;
    }

    return true;
}

export default isEqual;
