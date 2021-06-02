import { getProductProperties, getProducts } from '@/api/products'
import { Product, ProductId, ProductPropertyEntryDTO } from '@/api/types'
import {
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableHead,
  useMediaQuery,
  useTheme
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import produce from 'immer'
import Toolbar from './toolbar'
import ComparisonRow from './comparison-row'
import StyledTableCell from './styled-table-cell'

const useStyles = makeStyles(() => ({
  table: {
    width: '90vw',
    maxWidth: 1400,
    minWidth: 750,
    maxHeight: '50vh'
  }
}))

const ProductsTable: React.FC = () => {
  const classes = useStyles()
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [productProps, setProductProps] = useState<ProductPropertyEntryDTO[]>(undefined)
  const [products, setProducts] = useState<Product[]>(undefined)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [selected, setSelected] = useState<ProductId[]>([])
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => {
    getProductProperties()
      .then((data) => setProductProps(data))
      .catch((error) => console.log(error)) // ! dev
    getProducts()
      .then((data) => setProducts(data))
      .catch((error) => console.log(error)) // ! dev
  }, [])

  const onRowClick = (productId) =>
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

  const inSelected = (productId) => {
    const index = selected.indexOf(productId)
    return index > -1
  }

  // TODO Feature 2: Compare two products
  if (!productProps || !products) return <div>Loading...</div> // ? can be a spinner or a skeleton

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
      <TableContainer className={classes.table}>
        <Table size={upMd ? 'medium' : 'small'} stickyHeader>
          <TableHead>
            <TableRow>
              {productProps.map((prop, index) => (
                <StyledTableCell key={index}>{prop.label}</StyledTableCell>
              ))}
            </TableRow>
            {showComparison && <ComparisonRow selected={selected} products={products} productProps={productProps} />}
          </TableHead>
          <TableBody>
            {products.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((product) => (
              <TableRow key={product.id} hover selected={inSelected(product.id)} onClick={() => onRowClick(product.id)}>
                {productProps.map((prop) => {
                  let value = product[prop.name] || '-'
                  if (prop.name == 'tags' && value !== '-') {
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
