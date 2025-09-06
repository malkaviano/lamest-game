import { ArrayView } from './array.view';

describe('ArrayView', () => {
  describe('constructor auto-compacting', () => {
    it('should auto-compact when creating from large array', () => {
      const messages = Array.from(
        { length: 200 },
        (_, i) => `message-${i + 1}`
      ).reverse();

      const result = ArrayView.fromArray(messages);

      expect(result.items.length).toBe(150);
      expect(result.items[0]).toBe('message-200');
      expect(result.items[149]).toBe('message-51');
    });

    it('should not auto-compact when creating from small array', () => {
      const messages = Array.from(
        { length: 100 },
        (_, i) => `message-${i + 1}`
      ).reverse();

      const result = ArrayView.fromArray(messages);

      expect(result.items.length).toBe(100);
      expect(result.items[0]).toBe('message-100');
      expect(result.items[99]).toBe('message-1');
    });

    it('should auto-compact when using create method with large data', () => {
      const messages = Array.from(
        { length: 180 },
        (_, i) => `msg-${i + 1}`
      ).reverse();

      const result = ArrayView.create(...messages);

      expect(result.items.length).toBe(130);
      expect(result.items[0]).toBe('msg-180');
      expect(result.items[129]).toBe('msg-51');
    });

    it('should preserve exact limit when creating with 151 items', () => {
      const messages = Array.from(
        { length: 151 },
        (_, i) => `message-${i + 1}`
      ).reverse();

      const result = ArrayView.fromArray(messages);

      expect(result.items.length).toBe(101);
      expect(result.items[0]).toBe('message-151');
      expect(result.items[100]).toBe('message-51');
    });
  });
  describe('insert with auto-compacting', () => {
    it('should auto-compact when inserting into a collection that exceeds limit', () => {
      const messages = Array.from(
        { length: 150 },
        (_, i) => `message-${i + 1}`
      ).reverse();

      const arrayView = ArrayView.fromArray(messages);

      const result = arrayView.insert('new-message');

      expect(result.items.length).toBe(101);
      expect(result.items[0]).toBe('new-message');
      expect(result.items[1]).toBe('message-150');
      expect(result.items[100]).toBe('message-51');
    });

    it('should not auto-compact when inserting into a collection under limit', () => {
      const messages = Array.from(
        { length: 50 },
        (_, i) => `message-${i + 1}`
      ).reverse();
      const arrayView = ArrayView.fromArray(messages);

      const result = arrayView.insert('new-message');

      expect(result.items.length).toBe(51);
      expect(result.items[0]).toBe('new-message');
      expect(result.items[1]).toBe('message-50');
      expect(result.items[50]).toBe('message-1');
    });

    it('should handle inserting multiple messages with auto-compacting only once', () => {
      const messages = Array.from(
        { length: 150 },
        (_, i) => `message-${i + 1}`
      ).reverse();

      let arrayView = ArrayView.fromArray(messages);

      expect(arrayView.items.length).toBe(150);

      arrayView = arrayView.insert('message-151');

      arrayView = arrayView.insert('message-152');

      expect(arrayView.items.length).toBe(102);

      expect(arrayView.items[0]).toBe('message-152');

      expect(arrayView.items[1]).toBe('message-151');
    });
  });

  describe('limitMessages', () => {
    it('should return the same ArrayView when under the limit', () => {
      const messages = Array.from(
        { length: 100 },
        (_, i) => `message-${i + 1}`
      ).reverse();
      const arrayView = ArrayView.fromArray(messages);

      const result = ArrayView.limitMessages(arrayView.items);

      expect(result.items).toEqual(messages);
    });

    it('should remove oldest messages when limit is exceeded', () => {
      const messages = Array.from(
        { length: 200 },
        (_, i) => `message-${i + 1}`
      ).reverse();
      const arrayView = ArrayView.fromArray(messages);

      const result = ArrayView.limitMessages(arrayView.items);

      expect(result.items.length).toBe(150);
      expect(result.items[0]).toBe('message-200');
      expect(result.items[149]).toBe('message-51');
    });

    it('should use custom maxMessages and removeCount parameters', () => {
      const messages = Array.from(
        { length: 100 },
        (_, i) => `message-${i + 1}`
      ).reverse();
      const arrayView = ArrayView.fromArray(messages);

      const result = ArrayView.limitMessages(arrayView.items, 80, 30);

      expect(result.items.length).toBe(70);
      expect(result.items[0]).toBe('message-100');
      expect(result.items[69]).toBe('message-31');
    });

    it('should handle edge case where removeCount equals array length', () => {
      const messages = ['msg1', 'msg2', 'msg3'];
      const arrayView = ArrayView.fromArray(messages);

      const result = ArrayView.limitMessages(arrayView.items, 2, 3);

      expect(result.items.length).toBe(0);
    });

    it('should keep newest messages when limit is exactly reached', () => {
      const messages = Array.from(
        { length: 151 },
        (_, i) => `message-${i + 1}`
      ).reverse();
      const arrayView = ArrayView.fromArray(messages);

      const result = ArrayView.limitMessages(arrayView.items, 150, 50);

      expect(result.items.length).toBe(101);
      expect(result.items[0]).toBe('message-151');
      expect(result.items[100]).toBe('message-51');
    });
  });
});
