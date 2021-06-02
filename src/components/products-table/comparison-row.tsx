import { Product, ProductId, ProductPropertyEntryDTO } from '@/api/types'
import { Chip, useTheme, TableRow } from '@material-ui/core'
import React from 'react'
import StyledTableCell from './styled-table-cell'

interface ComparisonRowProps {
  selected: ProductId[]
  products: Product[]
  productProps: ProductPropertyEntryDTO[]
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({ selected, products, productProps }) => {
  const theme = useTheme()
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
        if (product1[productProp.name] === product2[productProp.name])
          return <StyledTableCell key={productProp.name}>{product1[productProp.name] || '-'}</StyledTableCell>
        return (
          <StyledTableCell key={productProp.name}>
            <Chip
              size="small"
              label={product1[productProp.name] || '-'}
              style={{
                backgroundColor: theme.palette.secondary.main,
                textDecoration: 'line-through'
              }}
            />
            <br />
            <Chip
              size="small"
              label={product2[productProp.name] || '-'}
              style={{ backgroundColor: theme.palette.primary.main, marginTop: 2 }}
            />
          </StyledTableCell>
        )
      })}
    </TableRow>
  )
}

export default ComparisonRow
