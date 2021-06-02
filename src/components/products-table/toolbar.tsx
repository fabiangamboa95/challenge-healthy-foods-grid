import React from 'react'
import { Button, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core'
import { ClearAll } from '@material-ui/icons'

interface ToolbarProps {
  numSelected: number
  onClearClick: () => void
  onComparisonClick: () => void
}

const useStyles = makeStyles(() => ({
  toolbar: {
    display: 'flex'
  },
  button: {
    marginLeft: 'auto'
  },
  typography: {
    marginLeft: 20
  }
}))

const MyToolbar: React.FC<ToolbarProps> = ({ numSelected, onClearClick, onComparisonClick }) => {
  const classes = useStyles()
  const _2selected = numSelected === 2

  return (
    <Toolbar className={classes.toolbar}>
      <IconButton disabled={numSelected === 0} onClick={onClearClick}>
        <ClearAll />
      </IconButton>
      {numSelected > 0 && (
        <Typography className={classes.typography}>{`${numSelected} product${
          numSelected > 1 ? 's' : ''
        } selected`}</Typography>
      )}
      <Button variant="contained" className={classes.button} disabled={!_2selected} onClick={onComparisonClick}>
        {_2selected ? 'compare products' : 'select 2 products to compare'}
      </Button>
    </Toolbar>
  )
}

export default MyToolbar
