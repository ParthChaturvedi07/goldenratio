declare module "locomotive-scroll" {
  interface LocomotiveScrollOptions {
    el: HTMLElement;
    smooth?: boolean;
    multiplier?: number;
    lerp?: number;
    smartphone?: { smooth?: boolean };
    tablet?: { smooth?: boolean };
  }

  interface LocomotiveScrollInstance {
    scroll: { instance: { scroll: { y: number } } };
    on(event: string, callback: (...args: unknown[]) => void): void;
    scrollTo(
      target: number | HTMLElement | string,
      options?: { duration?: number; disableLerp?: boolean; offset?: number }
    ): void;
    update(): void;
    destroy(): void;
  }

  export default class LocomotiveScroll implements LocomotiveScrollInstance {
    constructor(options: LocomotiveScrollOptions);
    scroll: { instance: { scroll: { y: number } } };
    on(event: string, callback: (...args: unknown[]) => void): void;
    scrollTo(
      target: number | HTMLElement | string,
      options?: { duration?: number; disableLerp?: boolean; offset?: number }
    ): void;
    update(): void;
    destroy(): void;
  }
}
