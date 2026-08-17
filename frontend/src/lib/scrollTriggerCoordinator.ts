"use client";

/**
 * Tracks which pinned GSAP sections are still setting up their
 * ScrollTrigger instances. The Home page waits until every registered
 * section reports "ready" before calling ScrollTrigger.refresh() and
 * performing any deferred scroll — instead of guessing a fixed delay.
 */
type Listener = () => void;

class ScrollTriggerCoordinator {
  private pending = new Set<string>();
  private listeners = new Set<Listener>();

  register(id: string) {
    this.pending.add(id);
  }

  ready(id: string) {
    if (!this.pending.has(id)) return;
    this.pending.delete(id);
    if (this.pending.size === 0) {
      this.listeners.forEach((l) => l());
    }
  }

  isReady() {
    return this.pending.size === 0;
  }

  /** Fires once when all currently-registered sections are ready.
   *  If already ready, fires on next microtask. Returns an unsubscribe fn. */
  onReady(listener: Listener): () => void {
    if (this.isReady()) {
      queueMicrotask(listener);
      return () => {};
    }
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Call when leaving the page so a future visit starts clean. */
  reset() {
    this.pending.clear();
    this.listeners.clear();
  }
}

export const scrollTriggerCoordinator = new ScrollTriggerCoordinator();