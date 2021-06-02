import React from 'react'
import { Button, IconButton, Toolbar, Typography } from '@material-ui/core'
import { ClearAll } from '@material-ui/icons'

interface ToolbarProps {
  numSelected: number
  onClearClick: () => void
  onComparisonClick: () => void
}

const MyToolbar: React.FC<ToolbarProps> = ({ numSelected, onClearClick, onComparisonClick }) => {
  const _2selected = numSelected === 2

  return (
    <Toolbar style={{ display: 'flex' }}>
      <IconButton disabled={numSelected === 0} onClick={onClearClick}>
        <ClearAll />
      </IconButton>
      {numSelected > 0 && (
        <Typography style={{ marginLeft: 20 }}>{`${numSelected} product${
          numSelected > 1 ? 's' : ''
        } selected`}</Typography>
      )}
      <Button variant="contained" style={{ marginLeft: 'auto' }} disabled={!_2selected} onClick={onComparisonClick}>
        {_2selected ? 'compare products' : 'select 2 products to compare'}
      </Button>
    </Toolbar>
  )
}

export default MyToolbar
