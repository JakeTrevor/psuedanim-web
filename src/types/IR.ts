export type IR = StateFrame[];

export type StateFrame = MemObject[];

export interface MemObject {
  label?: string;
  key: string;
  type: "literal" | "pointer" | "array" | "struct";
}

export interface literal extends MemObject {
  type: "literal";
  value: string | number | boolean;
}

export interface pointer extends MemObject {
  type: "pointer";
  value: string;
}

export interface array extends MemObject {
  type: "array";
  value: MemObject[];
}

export interface struct extends MemObject {
  type: "struct";
  value: Record<string, MemObject>;
}
