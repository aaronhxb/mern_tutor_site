import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from '../../app/api/apiSlice'

const userAdapter = createEntityAdapter({})

const initialState = userAdapter.getInitialState()

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: ()=>'/users/all',
            transformResponse: response => {
                const loadedUsers = response.map((user) => {
                    user.id = user._id
                    //console.log(user)
                    return user
                })
                return userAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: result => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type:'User', id}))
                    ]
                }else return [{ type: 'User', id: 'LIST' }]
            }
        }), 
        addNewUser: builder.mutation({
            query: user => ({
                url: '/users/new',
                method: 'POST',
                body: {...user,}
            }),
            invalidatesTags: [
                { type:'User', id: 'LIST' }
            ]
        }),
        updateUser: builder.mutation({
            query: user => ({
                url: `/users/update/${user.id}`,
                method: 'PUT',
                body: {
                    user,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type:'User', id: arg.id }
            ]
        }),
        getUser: builder.query({
            query: ({id})=>`/users/find/${id}`,
            providesTags: (result)=>[{ type: 'User', id: 'LIST' }]
        }),
        updateViewed: builder.mutation({
            query: ({userId, videoId, date})=>({
                url: `/users/viewed/${videoId}`,
                method: 'PUT',
                body: { userId, date }
            }),
            invalidatesTags: (result, error, arg) =>  [
                { type: 'User', id: arg.userId  }
            ]
        }),
        savedForLater: builder.mutation({
            query: ({ userId, videoId })=>({
                url: `/users/save/${videoId}`,
                method: 'PUT',
                body: { userId }
            })
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/users/delete',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type:'User', id: arg.id }
            ]
        })
    })
})

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useUpdateViewedMutation,
    useSavedForLaterMutation,
    useDeleteUserMutation
} = userApiSlice

// returns the query result object
export const selectUsersResult = userApiSlice.endpoints.getUsers.select()

// creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds,
    // Pass in a selector that returns the users slice of state
} = userAdapter.getSelectors(state => selectUsersData(state) ?? initialState)