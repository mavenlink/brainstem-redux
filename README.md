# REACT -> STORAGE MANAGER

- React updates posts -> store gets updated
- Store invokes all listeners
- Listener tries to update all models on storage manager
- Changed post actually updates and emits a change event
- Change event is handled by dispatched a CHANGE_MODEL action
- Store invokes all listeners
- Listener tries to update all models on storage manager
- Post does not change so backbone does not emit any event

# STORAGE MANAGER -> REACT

- Storage manager emits a change event
- Change event is handled by dispatching a CHANGE_MODEL action
- Store is updated
- Store invokes all listeners
- Listener tries to update all models on storage manager
- Model does not change so backbone does not emit any event
