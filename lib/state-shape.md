# Schema

    store := {
      brainstem: {
        stories: {
          1: {
            title: 'foo 1',
            status: 'completed'
          },
          42: {
            attributes: {
              id: 42,
              title: 'foo 2',
              status: 'not started'
            },
            state: 'sync' | 'request'
          }
        },
        posts: {},
        users: {
          1: {
            username: 'Bob McBobster',
            email: 'bob@bobster.com',
          }
        }
      },
      task-tracker: {},
      postsAutocompleter: {
        posts: [post_id, post_id, ...],
        filterText: 'some text',
        isFetching: false | true,
      }
    }


As a migration tool:
  - Listens on all data known to brainstem-js storage manager
  - Propagates changes to brainstem-js storage manager


## Synchronous

Listening:
  - Assuming the storage manager is set up
    - access it (globally?)
    - set up event handlers by using Backbone.Events


Propagation:
  - Subscribe to store (?)
  - Set appropriate model(s) data (change)
  - Update appropriate collections (add, remove)


## Asynchronous (make sure it works?)

Brainstem.Collection makes a fetch -> server responds with a brainstem payload
Storage manager parses the payload and updates its contents
Models emit a change event. Collections emit a change event.



# Version 0.1.0

Since Brainstem-js is tightly coupled with Backbone.Sync, the storage manager
will be driving the redux store:

- Each event handler will be its own action


# Version 0.2.0

The redux store can drive the storage manager

- Listener on store can update the storage manager
- or, Middleware can update the storage manager?

- Since each event handler has its own action, dispatched actions should also
  emit an event or invoke a method on the storage manager (but avoid cyclical
  flow?)


# Version ?.?.?

Since Brainstem-js is tightly coupled with Backbone.Sync
So decouple as `Brainstem.Sync`
