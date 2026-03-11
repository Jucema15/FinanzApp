declare module 'uuid' {
  export function v4(options?: any, buffer?: any, offset?: any): string;
  export function v1(options?: any, buffer?: any, offset?: any): string;
  export function validate(uuid: string): boolean;
  export function version(uuid: string): number;
  export function parse(uuid: string): Uint8Array;
  export function stringify(bytes: Uint8Array, offset?: number): string;
  export const NIL: string;
  export const MAX: string;
}
