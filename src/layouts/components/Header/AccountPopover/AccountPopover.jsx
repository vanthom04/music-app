import classNames from 'classnames/bind'
import jsCookie from 'js-cookie'
import Tippy from '@tippyjs/react/headless'

import { useRouter } from '~/hooks'
import { actions, useMusic } from '~/context'
import MenuItem from './MenuItem'
import Image from '~/components/Image'
import Button from '~/components/Button'
import styles from './AccountPopover.module.scss'

const cx = classNames.bind(styles)

const MENU_OPTIONS = [
  {
    path: 'home',
    label: 'Trang chủ'
  },
  {
    path: 'profile',
    label: 'Tài khoản'
  },
  {
    path: 'settings',
    label: 'Cài đặt'
  }
]

function AccountPopover() {
  const [state, dispatch] = useMusic()
  const router = useRouter()

  const handleClickItem = (item) => {
    // eslint-disable-next-line no-console
    console.log(item)
  }

  const handleLogout = () => {
    jsCookie.remove('accessToken')
    dispatch(actions.setUser(undefined))
    router.reload()
  }

  if (!state.user) return null

  const renderResult = (attrs) => (
    <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
      <header className={cx('header-menu')}>
        <h4 className={cx('title')}>
          {state.user.fullName}
        </h4>
        <p className={cx('email')}>
          {state.user.email}
        </p>
      </header>
      {MENU_OPTIONS.map((item) => (
        <MenuItem
          key={item.label}
          data={item}
          onClick={() => handleClickItem(item)}
        />
      ))}
      <footer className={cx('footer-menu')}>
        <Button className={cx('btn-logout')} onClick={() => handleLogout()}>
          Đăng xuất
        </Button>
      </footer>
    </div>
  )

  return (
    <Tippy
      interactive
      trigger="click"
      placement="bottom-end"
      render={renderResult}
    >
      <Image
        className={cx('avatar')}
        src={state.user.photoURL}
        alt={state.user.fullName}
      />
    </Tippy>
  )
}

export default AccountPopover
