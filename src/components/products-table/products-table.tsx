import { ProductId } from '@/api/types'
import {
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableHead,
  useMediaQuery,
  useTheme,
  Typography
} from '@material-ui/core'
import React, { useState } from 'react'
import produce from 'immer'
import Toolbar from './toolbar'
import ComparisonRow from './comparison-row'
import StyledTableCell from './styled-table-cell'
import { ProductsTableProps } from '../types'

const ProductsTable: React.FC<ProductsTableProps> = (props) => {
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const { productProperties, products } = props
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [selected, setSelected] = useState<ProductId[]>([])
  const [showComparison, setShowComparison] = useState(false)

  const onRowClick = (productId: ProductId) =>
    setSelected(
      produce(selected, (selectedDraft) => {
        const index = selectedDraft.indexOf(productId)
        if (index > -1) {
          selectedDraft.splice(index, 1)
        } else {
          selectedDraft.push(productId)
        }
        if (selectedDraft.length > 2) {
          selectedDraft.splice(0, 1)
        }
        if (selectedDraft.length < 2) setShowComparison(false)
      })
    )

  const isSelected = (productId: ProductId) => {
    const index = selected.indexOf(productId)
    return index > -1
  }

  if (!products || !productProperties) return <Typography variant="h2">Error Loading!</Typography>

  return (
    <Paper>
      <Toolbar
        numSelected={selected.length}
        onClearClick={() => {
          setSelected([])
          setShowComparison(false)
        }}
        onComparisonClick={() => setShowComparison(true)}
      />
      <TableContainer
        style={{
          width: '90vw',
          maxWidth: 1400,
          minWidth: 750,
          maxHeight: '50vh'
        }}
      >
        <Table size={upMd ? 'medium' : 'small'} stickyHeader>
          <TableHead>
            <TableRow>
              {productProperties.map((prop, index) => (
                <StyledTableCell key={index}>{prop.label}</StyledTableCell>
              ))}
            </TableRow>
            {showComparison && (
              <ComparisonRow selected={selected} products={products} productProps={productProperties} />
            )}
          </TableHead>
          <TableBody>
            {products.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((product) => (
              <TableRow key={product.id} hover selected={isSelected(product.id)} onClick={() => onRowClick(product.id)}>
                {productProperties.map((prop) => {
                  let value = product[prop.name] || '-'
                  if (prop.name === 'tags' && value !== '-') {
                    value = (value as string[]).join(', ')
                  }

                  return (
                    <TableCell component="th" key={`${prop.name}.${product.name}`}>
                      {value}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[15, 35, 60]}
        component="div"
        count={products.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={(_, newPage) => setPage(newPage)}
        onChangeRowsPerPage={(event) => {
          setRowsPerPage(+event.target.value)
          setPage(0)
        }}
      />
    </Paper>
  )
}

export default ProductsTable
