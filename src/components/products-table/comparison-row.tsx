import { Product, ProductId, ProductPropertyEntryDTO } from '@/api/types'
import { Chip, makeStyles, TableRow } from '@material-ui/core'
import React from 'react'
import StyledTableCell from './styled-table-cell'

interface ComparisonRowProps {
  selected: ProductId[]
  products: Product[]
  productProps: ProductPropertyEntryDTO[]
}

const useStyles = makeStyles((theme) => ({
  minor: {
    backgroundColor: theme.palette.secondary.main,
    textDecoration: 'line-through'
  },
  mayor: {
    backgroundColor: theme.palette.primary.main
  }
}))

const ComparisonRow: React.FC<ComparisonRowProps> = ({ selected, products, productProps }) => {
  const classes = useStyles()
  const product1 = products.find((product) => product.id === selected[0])
  const product2 = products.find((product) => product.id === selected[1])

  return (
    <TableRow>
      {productProps.map((productProp) => {
        if (productProp.name === 'name')
          return (
            <StyledTableCell key={productProp.name}>
              {product1[productProp.name]} vs <br /> {product2[productProp.name]}
            </StyledTableCell>
          )
        if (productProp.name === 'tags') return <StyledTableCell key={productProp.name}>-</StyledTableCell>
        console.log(product1[productProp.name], product2[productProp.name])
        if (product1[productProp.name] === product2[productProp.name])
          return <StyledTableCell key={productProp.name}>{product1[productProp.name] || '-'}</StyledTableCell>
        return (
          <StyledTableCell key={productProp.name}>
            <Chip size="small" label={product1[productProp.name] || '-'} className={classes.minor} />
            <br />
            <Chip
              size="small"
              label={product2[productProp.name] || '-'}
              className={classes.mayor}
              style={{ marginTop: 2 }}
            />
          </StyledTableCell>
        )
      })}
    </TableRow>
  )
}

export default ComparisonRow
