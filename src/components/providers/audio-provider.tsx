"use client"

import { useEffect, useRef } from "react"

import { usePlayer } from "@/hooks/use-player"

export const AudioProvider = () => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const {
    activeSong,
    isPlaying,
    isRepeat,
    isDragging,
    volume,
    setIsPlaying,
    setTime,
    setProgress,
    playNext
  } = usePlayer()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !activeSong) return

    const audioUrl = `/api/stream/audio/${activeSong.audio}`
    if (audio.src !== audioUrl) {
      audio.src = audioUrl
      audio.currentTime = 0
    }

    audio.play().catch(() => {
      setIsPlaying(false)
    })
  }, [activeSong, setIsPlaying])

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setTime(audioRef.current.currentTime, audioRef.current.duration || 0)
      if (!isDragging) {
        setProgress(audioRef.current.currentTime)
      }
    }
  }

  const onEnded = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isRepeat) {
      audio.currentTime = 0
      audio.play()
    } else {
      playNext()
    }
  }

  return (
    <audio
      autoPlay
      ref={audioRef}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      className="hidden"
    />
  )
}
