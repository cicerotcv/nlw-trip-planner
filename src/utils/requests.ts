export const wrapRequest =
  <P extends any[], R extends any>(request: (...args: P) => R) =>
  (...params: P): R => {
    try {
      return request(...params);
    } catch (e) {
      throw e;
    }
  };
