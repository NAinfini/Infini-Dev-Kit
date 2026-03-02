interface ListNode<K, V> {
  key: K;
  value: V;
  prev?: ListNode<K, V>;
  next?: ListNode<K, V>;
}

export class LRUMap<K, V> {
  private readonly maxSize: number;
  private readonly nodes = new Map<K, ListNode<K, V>>();
  private head?: ListNode<K, V>;
  private tail?: ListNode<K, V>;

  constructor(maxSize: number) {
    const normalizedSize = Math.floor(maxSize);
    if (!Number.isFinite(normalizedSize) || normalizedSize <= 0) {
      throw new Error("LRUMap maxSize must be a positive finite number");
    }

    this.maxSize = normalizedSize;
  }

  get size(): number {
    return this.nodes.size;
  }

  clear(): void {
    this.nodes.clear();
    this.head = undefined;
    this.tail = undefined;
  }

  has(key: K): boolean {
    return this.nodes.has(key);
  }

  get(key: K): V | undefined {
    const node = this.nodes.get(key);
    if (!node) {
      return undefined;
    }

    this.moveToHead(node);
    return node.value;
  }

  set(key: K, value: V): this {
    const existing = this.nodes.get(key);
    if (existing) {
      existing.value = value;
      this.moveToHead(existing);
      return this;
    }

    const node: ListNode<K, V> = { key, value };
    this.nodes.set(key, node);
    this.insertAtHead(node);

    if (this.nodes.size > this.maxSize) {
      this.evictTail();
    }

    return this;
  }

  delete(key: K): boolean {
    const node = this.nodes.get(key);
    if (!node) {
      return false;
    }

    this.detach(node);
    return this.nodes.delete(key);
  }

  private insertAtHead(node: ListNode<K, V>): void {
    node.prev = undefined;
    node.next = this.head;

    if (this.head) {
      this.head.prev = node;
    }

    this.head = node;
    if (!this.tail) {
      this.tail = node;
    }
  }

  private moveToHead(node: ListNode<K, V>): void {
    if (node === this.head) {
      return;
    }

    this.detach(node);
    this.insertAtHead(node);
  }

  private detach(node: ListNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    }

    if (node === this.head) {
      this.head = node.next;
    }

    if (node === this.tail) {
      this.tail = node.prev;
    }

    node.prev = undefined;
    node.next = undefined;
  }

  private evictTail(): void {
    if (!this.tail) {
      return;
    }

    const evictedKey = this.tail.key;
    this.detach(this.tail);
    this.nodes.delete(evictedKey);
  }
}
