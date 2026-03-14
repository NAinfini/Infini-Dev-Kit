type ViewTransitionCapableDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

export function startViewTransition(update: () => void): void {
  if (typeof document === "undefined") {
    update();
    return;
  }

  const doc = document as ViewTransitionCapableDocument;

  if (typeof doc.startViewTransition === "function") {
    try {
      doc.startViewTransition(update);
      return;
    } catch {
      // Fall back to the synchronous update if the API fails.
    }
  }

  update();
}
