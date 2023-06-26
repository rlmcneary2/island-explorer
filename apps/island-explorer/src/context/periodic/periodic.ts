/**
 * A class that will invoke a callback periodically using `setInterval`.
 */
export class Periodic {
  private _active = false;
  private _callback: ((...args: unknown[]) => void | Promise<void>) | undefined;
  private _callbackArgs: unknown[] | undefined;
  private _context: Record<string, unknown> = {};
  private _intervalMS: number | undefined;
  private _intervalHandle: number | undefined;
  private _nextUpdate = -1;

  /**
   * Create a new Periodic instance.
   * @param intervalMS The time between callbacks in milliseconds.
   * @param context Tramp data that gets stored with each instance.
   */
  constructor(intervalMS: number, context: Record<string, unknown> = {}) {
    if (0 < intervalMS) {
      this._intervalMS = intervalMS;
    } else {
      throw Error("intervalMS` must be greater than 0.");
    }

    this._context = context;
  }

  /**
   * If true the Periodic has a running interval.
   */
  get active() {
    return this._active;
  }

  /**
   * The arguments that will be passed to the callback function.
   */
  get callbackArgs() {
    return this._callbackArgs;
  }

  /**
   * Change the arguments that will be passed to the callback function.
   */
  set callbackArgs(args: unknown[] | undefined) {
    this._callbackArgs = args;
  }

  /**
   * Time when the callback will next be invoked.
   */
  get nextUpdate() {
    return this._nextUpdate;
  }

  /**
   * Get a context value.
   * @param key A key in the Record.
   */
  public getContextValue(key: string) {
    return this._context[key];
  }

  /**
   * Sets a key's value, will replace any existing value.
   * @param key A key in the Record.
   * @param value The value for the key.
   */
  public setContextValue(key: string, value: unknown): this {
    this._context[key] = value;
    return this;
  }

  public start<Args extends unknown[]>(callback: (...args: Args) => void): this;
  public start<Args extends unknown[]>(
    callback: (...args: Args) => void,
    immediate: boolean
  ): this;
  public start<Args extends unknown[]>(
    callback: (...args: Args) => void,
    callbackArgs: unknown[],
    immediate: boolean
  ): this;
  public start(
    callback: (...args: unknown[]) => void,
    ...args: unknown[]
  ): this {
    let immediate: boolean | undefined;
    for (const arg of args) {
      if (!arg) {
        continue;
      }
      if (typeof arg === "boolean") {
        immediate = arg;
      } else if (Array.isArray(arg)) {
        this._callbackArgs = arg;
      }
    }

    if (this._intervalHandle) {
      window.clearInterval(this._intervalHandle);
    }

    if (!this._intervalMS) {
      throw Error("_intervalMS has not been set.");
    }

    this._active = true;
    this._callback = callback;

    this._intervalHandle = this.createInterval();

    if (immediate) {
      setTimeout(() => {
        this._callback && this._callback.call(this, ...this._callbackArgs);
      }, 0);
    }

    return this;
  }

  protected createInterval() {
    this._nextUpdate = Date.now() + (this._intervalMS as number);

    return window.setInterval(() => {
      this._nextUpdate = Date.now() + (this._intervalMS as number);
      this._callback && this._callback.call(this, ...this._callbackArgs);
    }, this._intervalMS);
  }
}
