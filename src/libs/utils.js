let checkPhone = function (phone) {
  return /^0?(1)\d{10}$/.test(phone)
}

module.exports = {
  checkPhone: checkPhone
}
