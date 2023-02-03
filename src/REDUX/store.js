import { configureStore } from '@reduxjs/toolkit'
import testReducer from './SLICES/TestSlice'
import loadingReducer from './SLICES/LoadingSlice'
import successReducer from './SLICES/SuccessSlice'
import failureReducer from './SLICES/FailureSlice'
import blogsReducer from './SLICES/BlogsSlice'
import blogPostReducer from './SLICES/BlogPostSlice'
import productsReducer from './SLICES/ProductsSlice'
import dashUserReducer from './SLICES/DashboardUserSlice'
import pageViewsReducer from './SLICES/PageViewsSlice'
import contactEntriesReducer from './SLICES/ContactEntriesSlice'
import eventTypesReducer from './SLICES/EventTypesSlice'
import scheduledEventsReducer from './SLICES/ScheduledEventsSlice'

export default configureStore({
  reducer: {
    test: testReducer,
    loading: loadingReducer,
    success: successReducer,
    failure: failureReducer,
    blogs: blogsReducer,
    blogPost: blogPostReducer,
    products: productsReducer,
    dashUser: dashUserReducer,
    pageViews: pageViewsReducer,
    contactEntries: contactEntriesReducer,
    eventTypes: eventTypesReducer,
    scheduledEvents: scheduledEventsReducer
  },
})

/*
    const test = useSelector((state) => state.test.value)
    const dispatch = useDispatch()
*/