import { getProductProperties, getProducts } from '@/api/products'
import { Product, ProductPropertyEntryDTO } from '@/api/types'
import {
  makeStyles,
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  withStyles,
  TablePagination,
  TableHead,
  useMediaQuery,
  useTheme
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'

const useStyles = makeStyles(() => ({
  table: {
    width: '80vw',
    maxWidth: 1400,
    minWidth: 650,
    maxHeight: 400
  }
}))

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.grey[700]
    }
  }
}))(TableRow)

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell)

const ProductsTable: React.FC = () => {
  const classes = useStyles()
  const theme = useTheme()
  const upMd = useMediaQuery(theme.breakpoints.up('md'))
  const [productProps, setProductProps] = useState<[ProductPropertyEntryDTO]>(undefined)
  const [products, setProducts] = useState<[Product]>(undefined)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(15)

  useEffect(() => {
    getProductProperties()
      .then((data) => setProductProps(data))
      .catch((error) => console.log(error)) // ! dev
    getProducts()
      .then((data) => setProducts(data))
      .catch((error) => console.log(error)) // ! dev
  }, [])

  // TODO Feature 1: Display products in a rich text table
  // TODO Feature 2: Compare two products
  if (!productProps || !products) return <div>Loading...</div> // ? can be a spinner or a skeleton

  return (
    <Paper>
      <TableContainer className={classes.table}>
        <Table size={upMd ? 'medium' : 'small'} stickyHeader>
          <TableHead>
            <TableRow>
              {productProps.map((prop, index) => (
                <StyledTableCell key={index}>{prop.label}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((product) => (
              <StyledTableRow key={`${product.name}.${product.energy}`}>
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
              </StyledTableRow>
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
