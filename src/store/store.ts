import { configureStore } from '@reduxjs/toolkit'
import generatorReducer from './generatorSlice'
import networksPathSlice from './networksPathSlice'


export const store = configureStore({
  reducer: {
    generator: generatorReducer,
    networksPath: networksPathSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch