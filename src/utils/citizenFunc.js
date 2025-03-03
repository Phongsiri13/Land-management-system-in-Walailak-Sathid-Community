// splitFullName.js
export function splitFullName(fullname) {
  const [citizen_fname, citizen_lname] = fullname.trim().split(' ')

  return { citizen_fname, citizen_lname }
}

export function genderSelection(prefix_value) {
  // console.log('genderSelection:', this.formPeopleData.prefix)
  if (prefix_value == 1) {
    return '1'
  } else if (prefix_value == 2) {
    return '0'
  } else if (prefix_value == 3) {
    return '0'
  } else {
    return ''
  }
}
