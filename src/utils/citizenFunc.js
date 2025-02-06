// splitFullName.js
export function splitFullName(fullname) {
  const [citizen_fname, citizen_lname] = fullname.trim().split(' ')

  return { citizen_fname, citizen_lname }
}

