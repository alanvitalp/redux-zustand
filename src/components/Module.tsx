import { ChevronDown } from "lucide-react"
import { Lesson } from "./Lesson";
import * as Collapsible from '@radix-ui/react-collapsible';
import { useStore } from "../zustand-store";

interface Props {
  title: string;
  numberOfLessons: number
  moduleIndex: number
}

export const Module = ({ title, moduleIndex, numberOfLessons }: Props) => {
  const { currentLessonIndex, currentModuleIndex, play, lessons } = useStore(store => {
    return {
      lessons: store.course?.modules[moduleIndex].lessons,
      currentLessonIndex: store.currentLessonIndex,
      currentModuleIndex: store.currentModuleIndex,
      play: store.play
    }
  })

  return (
    <Collapsible.Root className="group" defaultOpen={moduleIndex === 0}>
      <Collapsible.Trigger className="flex items-center w-full gap-3 p-4 bg-zinc-800">
        <div className="flex items-center justify-center w-10 h-10 text-xs rounded-full bg-zinc-950">
          {moduleIndex + 1}
        </div>

        <div className="flex flex-col gap-1 text-left">
          <strong>{title}</strong>
          <span className="text-xs text-zinc-400">{numberOfLessons}</span>
        </div>

          <ChevronDown className="w-5 h-5 ml-auto text-zinc-400 group-data-[state=open]:rotate-180 transition-transform" />
      </Collapsible.Trigger>

      <Collapsible.Content>
        <nav className="relative flex flex-col gap-4 p-6">
          {lessons && lessons.map((lesson, lessonIndex) => {
            const isCurrent = currentModuleIndex === moduleIndex &&
              currentLessonIndex === lessonIndex

            return (
              <Lesson 
                title={lesson.title} 
                duration={lesson.duration} 
                key={lesson.id} 
                onPlay={() => play([moduleIndex, lessonIndex])}
                isCurrent={isCurrent}
              />
            )
          })}
        </nav>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}