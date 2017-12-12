import { Collection } from 'brainstem-js';
import defaultAdapter from '../../lib/adapters/default';

const test = it;

describe('adapters default', () => {
  test('collectionToIds', () => {
    const collection = new Collection([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(defaultAdapter.collectionToIds(collection)).toEqual([1, 2, 3]);
  });

  test('extractPayload', () => {
    const collection = new Collection([
      { id: 1, foo: 'bar' },
      { id: 2, foo: 'baz' },
    ]);
    collection.lastFetchOptions = {
      page: 2,
      perPage: 10,
    };
    spyOn(collection, '_getCacheObject').and.returnValue({ count: 101 });

    expect(defaultAdapter.extractPayload(collection)).toEqual({
      results: [
        { id: 1, foo: 'bar' },
        { id: 2, foo: 'baz' },
      ],
      count: 101,
      currentPage: 2,
      totalPages: 11,
    });
  });
});
