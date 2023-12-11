import { type StateFrame } from "~/types/IR";

export type Value = string | number | boolean | string[] | number[] | boolean[];
export type ContextPath = (string | number)[];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Scope extends Record<string | number, Value | Scope> {}

export class Context {
  scope: Scope;
  parent?: Context;

  constructor(parent?: Context) {
    if (parent) this.parent = parent;
    this.scope = {};
  }

  get = (path: ContextPath): Value | undefined => {
    // @ts-expect-error - cast is not type safe in general, but for well typed programs its OK
    let result: Value | undefined = path.reduce((acc, val) => {
      if (acc !== undefined) return acc[val] as Scope;
      return acc;
    }, this.scope);

    if (result === undefined && this.parent) {
      result = this.parent.get(path);
    }

    return result;
  };

  set = (path: ContextPath, value: Value) => {
    if (this.parent?.get(path) !== undefined) {
      this.parent.set(path, value);
    } else {
      let s = this.scope;
      while (path.length > 1) {
        const next = path.shift()!;
        s = s[next] as Scope;
      }
      const next = path.pop()!;
      s[next] = value;
    }
  };

  makeFrame = (): StateFrame => {
    let frame: StateFrame;

    if (this.parent) {
      frame = this.parent.makeFrame();
    } else {
      frame = [];
    }

    frame = frame.concat(
      Object.keys(this.scope).map((varName) => {
        //currently, we only cover arrays and literals
        const value = this.scope[varName];
        if (Array.isArray(value)) {
          return {
            label: varName,
            type: "array",
            key: varName,
            value: value.map((val, i) => {
              return {
                key: `${varName}-${i}`,
                type: "literal",
                value: val,
              };
            }),
          };
        }

        return {
          label: varName,
          type: "literal",
          key: varName,
          value: value,
        };
      }),
    );
    return frame;
  };
}
