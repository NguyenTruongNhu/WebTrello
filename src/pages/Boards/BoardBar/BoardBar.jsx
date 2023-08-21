import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'
const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function BoardBar({ board }) {
  return (
    <Box
      px={2}
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) =>
          theme.palette.mode == 'dark' ? '#34495e' : '#1976d2'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label={board.title}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
          variant="outlined"
          startIcon={<PersonAddIcon />}
        >
          Invite
        </Button>
        <AvatarGroup
          max={2}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title="truongnhudev">
            <Avatar
              alt="truongnhudev"
              src="https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-7&_nc_sid=7206a8&_nc_ohc=5O4n-ddWtMEAX-LUJG7&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAw1cJnOCF69ZnyUIDm5hBiNkhgtaaC3GnlQdEolrXo4w&oe=6506A2F8"
            />
          </Tooltip>
          <Tooltip title="truongnhudev">
            <Avatar
              alt="truongnhudev"
              src="https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-7&_nc_sid=7206a8&_nc_ohc=5O4n-ddWtMEAX-LUJG7&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAw1cJnOCF69ZnyUIDm5hBiNkhgtaaC3GnlQdEolrXo4w&oe=6506A2F8"
            />
          </Tooltip>
          <Tooltip title="truongnhudev">
            <Avatar
              alt="truongnhudev"
              src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-1/329615714_5863808357047444_4212567626903558077_n.jpg?stp=dst-jpg_p160x160&_nc_cat=102&ccb=1-7&_nc_sid=2fc63d&_nc_ohc=s7Pfx24_1WYAX_KAHl4&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfDHM6dWN26OpRSl0Jf_9VGfN6e1i57EMwLDCBw4wbKh-g&oe=64AC7543"
            />
          </Tooltip>
          <Tooltip title="truongnhudev">
            <Avatar
              alt="truongnhudev"
              src="https://scontent.fsgn5-11.fna.fbcdn.net/v/t39.30808-1/349714490_765014901779046_115063072825171403_n.jpg?stp=dst-jpg_p160x160&_nc_cat=110&ccb=1-7&_nc_sid=2fc63d&_nc_ohc=J48O9G0a-MEAX_MtN6n&_nc_ht=scontent.fsgn5-11.fna&oh=00_AfBbspZJxx_BwQJL0Vg09Jl4ULRV104zsVDkTe96PZLNmw&oe=64ADB170"
            />
          </Tooltip>
          <Tooltip title="truongnhudev">
            <Avatar
              alt="truongnhudev"
              src="https://scontent.fsgn5-2.fna.fbcdn.net/v/t1.6435-1/81449625_104768611034806_495999668203814912_n.jpg?stp=dst-jpg_p160x160&_nc_cat=105&ccb=1-7&_nc_sid=2fc63d&_nc_ohc=eyDRoEy6ZGYAX-FCg5E&_nc_ht=scontent.fsgn5-2.fna&oh=00_AfBdXGTQhIWGM1ZMz92d4mlwTBrWHysfPjJry8hTgt00QA&oe=64CF602C"
            />
          </Tooltip>
          <Tooltip title="truongnhudev">
            <Avatar
              alt="truongnhudev"
              src="https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-1/267766513_635434494324398_8814999849597165962_n.jpg?stp=dst-jpg_p160x160&_nc_cat=108&ccb=1-7&_nc_sid=2fc63d&_nc_ohc=8oZb_iF-vDYAX9KWYr3&_nc_ht=scontent.fsgn5-6.fna&oh=00_AfADh19tJOPsvsnkwQ9V-ZM-yoHk9lidoZQ0vOG8A9L8IQ&oe=64AC66B4"
            />
          </Tooltip>
          <Tooltip title="truongnhudev">
            <Avatar
              alt="truongnhudev"
              src="https://scontent.fsgn5-15.fna.fbcdn.net/v/t1.6435-1/161283479_3703840383067161_1397029736890089502_n.jpg?stp=dst-jpg_p160x160&_nc_cat=111&ccb=1-7&_nc_sid=2fc63d&_nc_ohc=kIOb2p89NWcAX9fXDfV&_nc_ht=scontent.fsgn5-15.fna&oh=00_AfCWmhRsjTpY3bHYf-zfgyVH_ILC6evB9gajMKdVVpnREA&oe=64CF669B"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
