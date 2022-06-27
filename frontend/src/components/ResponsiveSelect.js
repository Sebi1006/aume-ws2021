import React from 'react'
import PropTypes from 'prop-types'
import { TextField, useMediaQuery } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import { fieldToTextField } from 'formik-material-ui'

function renderOptions (values, isDesktop) {
  return isDesktop ? values.map((value) => <MenuItem value={value.id} key={value.id}>{value.name}</MenuItem>)
    : values.map((value) => <option value={value.id} key={value.id}>{value.name}</option>)
}

const MenuProps = {
  variant: 'menu',
  getContentAnchorEl: null,
}

const ResponsiveSelect = ({ options, ...rest }) => {

  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('lg'))

  return rest.form ? (
    <TextField
      {...fieldToTextField(rest)}
      type="text"
      select
      SelectProps={{
        native: !isDesktop,
        multiple: rest.multiple,
        MenuProps,
      }}>
      {renderOptions(options, isDesktop)}
    </TextField>
  ) : (
    <TextField
      {...rest}
      type="text"
      select
      SelectProps={{
        native: !isDesktop,
        multiple: rest.multiple,
        MenuProps,
      }}>
      {renderOptions(options, isDesktop)}
    </TextField>
  )
}

ResponsiveSelect.propTypes = {
  options: PropTypes.array.isRequired,
}

export default ResponsiveSelect
