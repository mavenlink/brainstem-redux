import { Collection } from 'brainstem-js';
import defaultAdapter from '../../lib/adapters/default';

const test = it;

describe('adapters default', () => {
  test('collectionToIds', () => {
    const collection = new Collection([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(defaultAdapter.collectionToIds(collection)).toEqual([1, 2, 3]);
  });

  test('collectionToArray', () => {
    const collection = new Collection([{ foo: 'bar' }, { foo: 'baz' }]);
    expect(defaultAdapter.collectionToArray(collection)).toEqual([
      { foo: 'bar' },
      { foo: 'baz' },
    ]);
  });
});
