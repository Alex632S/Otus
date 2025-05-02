function deepEqual(actual, expected, path = "$") {
  // 1. Примитивы и строгое равенство
  if (actual === expected) return { equal: true };

  // 2. Обработка null/undefined
  if (actual == null || expected == null || typeof actual !== typeof expected) {
    return { equal: false, path };
  }

  // 3. Числа (включая NaN)
  if (typeof actual === "number" && typeof expected === "number") {
    return {
      equal: Number.isNaN(actual) && Number.isNaN(expected),
      path: Number.isNaN(actual) === Number.isNaN(expected) ? path : undefined,
    };
  }

  // 4. Объекты-обертки примитивов
  if (
    actual instanceof String ||
    actual instanceof Number ||
    actual instanceof Boolean ||
    expected instanceof String ||
    expected instanceof Number ||
    expected instanceof Boolean
  ) {
    if (actual.valueOf() === expected.valueOf()) return { equal: true };
    return { equal: false, path };
  }

  // 5. Массивы
  if (Array.isArray(actual) && Array.isArray(expected)) {
    if (actual.length !== expected.length) {
      return { equal: false, path: `${path}.length` };
    }
    for (let i = 0; i < actual.length; i++) {
      const result = deepEqual(actual[i], expected[i], `${path}[${i}]`);
      if (!result.equal) return result;
    }
    return { equal: true };
  }

  // 6. Объекты
  if (typeof actual === "object" && typeof expected === "object") {
    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);

    if (actualKeys.length !== expectedKeys.length) {
      return { equal: false, path: `${path}.keys` };
    }

    for (const key of actualKeys) {
      if (!expected.hasOwnProperty(key)) {
        return { equal: false, path: `${path}.${key}` };
      }
      const result = deepEqual(actual[key], expected[key], `${path}.${key}`);
      if (!result.equal) return result;
    }
    return { equal: true };
  }

  return { equal: actual === expected, path };
}

export default deepEqual;
