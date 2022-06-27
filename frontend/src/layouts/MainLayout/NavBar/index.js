import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Box, Divider, Drawer, Hidden, List, makeStyles, Typography } from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/Dashboard'
import AccountIcon from '@material-ui/icons/AccountCircle'
import HistoryIcon from '@material-ui/icons/History'
import Settings from '@material-ui/icons/Settings'
import GetAppIcon from '@material-ui/icons/GetApp'
import Link from '@material-ui/core/Link'
import { useTranslation } from 'react-i18next'
import NavItem from './NavItem'
import PwaInstall from './PwaInstall'

const items = [
  {
    href: '/app/dashboard',
    icon: DashboardIcon,
    title: 'navbar.dashboard',
  },
  {
    href: '/app/history',
    icon: HistoryIcon,
    title: 'navbar.history',
  },
  {
    href: '/app/profile',
    icon: AccountIcon,
    title: 'navbar.profil',
  },
  /* { User Story: AUWS202101-113 Automatisches Freischalten
  der Ladestation zu vorkonfigurierten Zeiten
    href: '/app/config',
    icon: EvStationIcon,
    title: 'navbar.config',
  }, */
  {
    href: '/app/settings',
    icon: Settings,
    title: 'navbar.settings',
  },
]

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
}))

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles()
  const location = useLocation()
  const { t } = useTranslation()

  const [supportsPWA, setSupportsPWA] = useState(false)
  const [promptInstall, setPromptInstall] = useState(null)

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose()
    }

    const handler = (e) => {
      e.preventDefault()
      setSupportsPWA(true)
      setPromptInstall(e)
    }

    window.addEventListener('beforeinstallprompt', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const installPWA = () => {
    if (!promptInstall) {
      return
    }
    promptInstall.prompt()
  }

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column">

      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={t(item.title)}
              icon={item.icon}
            />
          ))}
        </List>
        {
          supportsPWA ? (
            <div>
              <Divider/>
              <PwaInstall
                key={t('navbar.installpwa')}
                title={t('navbar.installpwa')}
                icon={GetAppIcon}
                installPWA={installPWA}
                />
            </div>
          )
            : <div/>
        }
      </Box>
      <Box flexGrow={1}/>
      <Box display="flex" pl={2} pb={1}>
        <Typography variant="body1">
          &copy;
          {' '}
          <Link
            component="a"
            href="https://www.siobra.de/"
            target="_blank">
            Siobra
          </Link>
          . 2020
        </Typography>
      </Box>
    </Box>
  )

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary">
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent">
          {content}
        </Drawer>
      </Hidden>
    </>
  )
}

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
}

NavBar.defaultProps = {
  onMobileClose: () => {
  },
  openMobile: false,
}

export default NavBar
