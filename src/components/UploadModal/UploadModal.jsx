import { useState } from 'react'
import toast from 'react-hot-toast'
import classNames from 'classnames/bind'

import { createNewPlaylist } from '~/services/playlistService'
import { useUser, useUploadModal, usePlaylist } from '~/hooks'
import Modal from '~/components/Modal'
import Input from '~/components/Input'
import Button from '~/components/Button'
import styles from './UploadModal.module.scss'

const cx = classNames.bind(styles)

function UploadModal() {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const { user } = useUser()
  const playlist = usePlaylist()
  const uploadModal = useUploadModal()

  const onChange = (open) => {
    if (!open) {
      uploadModal.onClose()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    if (!title) {
      return toast.error('Vui lòng nhập đầy đủ thông tin!')
    }

    setLoading(true)
    const formData = new FormData(e.target)
    const res = await createNewPlaylist(user.id, formData, user.accessToken)
    if (res.success) {
      toast.success('Tạo danh sách phát thành công!')
      uploadModal.onClose()
      playlist.onReload()
      setTitle('')
      setLoading(false)
    } else {
      toast.error('Tạo mới không thành công')
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Tạo mới danh sách phát"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form
        className={cx('form-upload')}
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          value={title}
          name="title"
          className={cx('input')}
          disabled={loading}
          placeholder="Nhập tên danh sách phát"
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <div className={cx('title-file-image')}>
            Chọn hình ảnh
          </div>
          <Input
            type="file"
            name="imageFile"
            accept="image/*"
            disabled={loading}
            className={cx('input-file')}
          />
        </div>

        <Button
          className={cx('btn-submit')}
          disabled={loading}
          type="submit"
        >
          Tạo mới
        </Button>
      </form>

    </Modal>
  )
}

export default UploadModal
