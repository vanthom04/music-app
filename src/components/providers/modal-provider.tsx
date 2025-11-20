"use client"

import { useState, useEffect } from "react"

import { TwoFactorModal } from "@/modules/account/ui/modals/two-factor-modal"
import { SetPasswordModal } from "@/modules/account/ui/modals/set-password-modal"
import { NewPlaylistModal } from "@/modules/playlists/ui/modals/new-playlist-modal"
import { PreviewLyricsModal } from "@/modules/songs/ui/modals/preview-lyrics-modal"
import { AddLikedSongsModal } from "@/modules/liked/ui/modals/add-liked-songs-modal"
import { UpdatePasskeyModal } from "@/modules/account/ui/modals/update-passkey-modal"
import { EditPlaylistModal } from "@/modules/playlists/ui/modals/edit-playlist-modal"
import { UpdatePasswordModal } from "@/modules/account/ui/modals/update-password-modal"
import { UpdateSongLyricsModal } from "@/modules/songs/ui/modals/update-song-lyrics-modal"
import { AddSongsPlaylistModal } from "@/modules/playlists/ui/modals/add-songs-playlist-modal"

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <UpdatePasskeyModal />
      <TwoFactorModal />
      <SetPasswordModal />
      <UpdatePasswordModal />
      <NewPlaylistModal />
      <EditPlaylistModal />
      <AddLikedSongsModal />
      <AddSongsPlaylistModal />
      <UpdateSongLyricsModal />
      <PreviewLyricsModal />
    </>
  )
}
