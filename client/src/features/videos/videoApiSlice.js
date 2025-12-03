import { createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { apiSlice } from "../../app/api/apiSlice"

const videoAdapter = createEntityAdapter({})

const initialState = videoAdapter.getInitialState()

export const videoApiSlice = apiSlice.injectEndpoints({
    endpoints: builder=>({
        getVideos: builder.query({
            query: ()=>'/videos/all',
            transformResponse: response=>{
                const loadedVideos = response.map(video=>{
                    video.id = video._id
                    return video
                })
                return videoAdapter.setAll(initialState, loadedVideos)
            },
            providesTags: result=>{
                if(result?.ids){
                    return [
                        { type:'Video', id: 'LIST' },
                        ...result.ids.map(id=>({type:'Video', id}))
                    ]
                }else return [{ type:'Video', id: 'LIST' }]
            }
        }),
        getVideo: builder.query({
            query:({ id })=> `/videos/find/${id}`,
            providesTags: (result, error, arg)=>[
                { type:'Video', id:'LIST' }
            ]
        }),
        searchVideos: builder.query({
            query: ({query})=>`/videos/search${query}`,
            transformResponse: response=>{
                const loadedVideos = response.map(video=>{
                    video.id = video._id
                    return video
                })
                return videoAdapter.setAll(initialState, loadedVideos)
            },
            providesTags: result=>{
                if(result?.ids){
                    return [
                        { type:'Video', id: 'LIST' },
                        ...result.ids.map(id=>({type:'Video', id}))
                    ]
                }else return [{ type:'Video', id: 'LIST' }]
            }
        }),
        getTag: builder.query({
            query: ({tag})=>`/videos/tag${tag}`,
            transformResponse: response=>{
                const loadedVideos = response.map((video)=>{
                    video.id=video._id
                    return video
                })
                return videoAdapter.setAll(initialState, loadedVideos)
            },
            providesTags: result=>{
                if(result?.ids) {
                    return [
                        { type: "Video", id: "LIST" },
                        ...result.ids.map((id)=>({type:"Video", id}))
                    ]
                }else return [{ type: "Video", id: "LIST" }]
            }
        }),
        uploadVideo: builder.mutation({
            query: newVideo=>({
                url: '/videos/add',
                method: 'POST',
                body: {...newVideo,},
            }),
            invalidatesTags: [{ type:'Video', id:'LIST' }]
        }),
        deleteVideo: builder.mutation({
            query: ({ id })=>({
                url: '/videos/delete',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg)=>[
                { type:'Video', id:arg.id }
            ]
        })
    })
})

export const {
    useGetVideosQuery,
    useGetVideoQuery,
    useSearchVideosQuery,
    useGetTagQuery,
    useUploadVideoMutation,
    useDeleteVideoMutation
} = videoApiSlice

export const selectVideosResult = videoApiSlice.endpoints.getVideos.select()

const selectVideosData = createSelector(
    selectVideosResult,
    videosResult => videosResult.data
)

export const {
    selectAll: selectAllVideos,
    selectById: selectVideoById,
    selectIds: selectVideoIds
} = videoAdapter.getSelectors(state => selectVideosData(state) ?? initialState)