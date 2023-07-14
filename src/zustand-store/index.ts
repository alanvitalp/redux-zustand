import { create } from "zustand";
import { api } from "../lib/axios";

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

  play: (moduleAndLessonIndex: [number, number]) => void
  next: () => void;
  load: () => Promise<void>
}

export const useStore = create<PlayerState>((set, get) => {
  return {
    course: null,
    currentLessonIndex: 0,
    currentModuleIndex: 0,
    isLoading: false,

    load: async () => {
      set({ isLoading: true })
      const response = await api.get(`/courses/1`)
      
      set({ course: response.data, isLoading: false })
    },

    play: (moduleAndLessonIndex: [number, number]) => {
      const [moduleIndex, lessonIndex] = moduleAndLessonIndex

      set({
        currentModuleIndex: moduleIndex,
        currentLessonIndex: lessonIndex
      })
    },
    next: () => {
      const { currentLessonIndex, currentModuleIndex, course } = get()
      const nextLessonIndex = currentLessonIndex + 1

      const nextLesson = course?.modules[currentModuleIndex].lessons[nextLessonIndex]

      if (nextLesson) {
        set({ currentLessonIndex: nextLessonIndex })
      } else {
        const nextModuleIndex = currentModuleIndex + 1

        const nextModule = course?.modules[nextModuleIndex]

        if (nextModule) {
          set({
            currentLessonIndex: 0,
            currentModuleIndex: nextModuleIndex
          })
        }
      }
    }
  }
})

export const useCurrentLesson = () => {
  return useStore(state => {
    const { currentModuleIndex, currentLessonIndex} = state

    const currentModule = state.course?.modules[currentModuleIndex]
    const currentLesson = state.course?.modules[currentModuleIndex].lessons[currentLessonIndex]

    return { currentModule, currentLesson }
  })
}