import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAppSelector } from "..";
import { api } from "../../lib/axios";

interface Course {
  id: number;
  modules: Array<{
    id: number
    title: string
    lessons: Array<{
      id: string;
      duration: string
      title: string
    }>
  }>
}

export interface PlayerState {
  currentModuleIndex: number;
  currentLessonIndex: number;
  course: Course | null;
  isLoading: boolean;
}

const initialState: PlayerState = {
  course: null,
  currentLessonIndex: 0,
  currentModuleIndex: 0,
  isLoading: true,
}

export const loadCourse = createAsyncThunk(
  'player/load',
  async () => {
      const response = await api.get(`/courses/1`)
      
      return response.data
    }
)

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play: (state, action: PayloadAction<[number, number]>) => {
      state.currentModuleIndex = action.payload[0]
      state.currentLessonIndex = action.payload[1]
    },
    next: (state) => {
      const nextLessonIndex = state.currentLessonIndex + 1

      const nextLesson = state.course?.modules[state.currentModuleIndex].lessons[nextLessonIndex]

      if (nextLesson) {
        state.currentLessonIndex = nextLessonIndex
      } else {
        const nextModuleIndex = state.currentModuleIndex + 1

        const nextModule = state.course?.modules[nextModuleIndex]

        if (nextModule) {
          state.currentModuleIndex =  nextModuleIndex

          const nextLesson = state.course?.modules[nextModuleIndex].lessons[0]

          if (nextLesson) {
            state.currentLessonIndex = 0
          }
        }
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(loadCourse.pending, (state) => {
      state.isLoading = true
    })

    builder.addCase(loadCourse.fulfilled, (state, action) => {
      state.course = action.payload
      state.isLoading = false
    })
  }
})

export const player = playerSlice.reducer

export const { play, next } = playerSlice.actions