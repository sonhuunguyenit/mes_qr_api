const Helper = {
  /**
   * Match a list of conditions to a fallback value.
   * @template T
   * @param {([boolean, T][])} conditions - Array of conditions.
   * @param {T} fallback - Fallback value.
   * @returns {T}
   */
  match: <T>(conditions: [boolean, T][], fallback: T): T =>
    conditions.find(([cond]) => cond)?.[1] ?? fallback,
};

export default Helper;
