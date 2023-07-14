import { MessageCircle } from "lucide-react";
import { Module } from "../components/Module";

import { useEffect } from 'react'
import { useCurrentLesson, useStore } from "../zustand-store";
import { Header } from "../components/Header";
import { Video } from "../components/Video";

export function Player() {
  const { course, load } = useStore(store => {
    return {
      course: store.course,
      load: store.load
    }
  })

  const { currentLesson } = useCurrentLesson();

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (currentLesson) {
      document.title = `Assistindo: ${currentLesson.title}`
    }
  }, [currentLesson])
  

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-50">
      <div className="flex w-[1100px] flex-col gap-6">
        <div className="flex items-center justify-between">
          <Header />

          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded bg-violet-500 hover:bg-violet-600">
            <MessageCircle className="w-4 h-4"/>
            Deixar feedback
          </button>
        </div>

        <main className="relative flex overflow-hidden border rounded-lg shadow border-zinc-800 bg-zinc-900 pr-80">
          <Video />
          <aside className="absolute top-0 bottom-0 right-0 border-l w-80 border-zinc-800 bg-zinc-900 scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-800">
            {course?.modules && course?.modules.map((module, index) => {
              return (
                <Module 
                  moduleIndex={index}
                  numberOfLessons={module.lessons.length} 
                  title={module.title}
                  key={module.id} 
                />
              )
            })}
          </aside>
        </main>
      </div>
    </div>
  )
}