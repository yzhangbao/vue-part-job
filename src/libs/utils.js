let checkPhone = function (phone) {
  return /^0?(1)\d{10}$/.test(phone)
}

let getQueryStr = function (name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

module.exports = {
  checkPhone: checkPhone,
  getQueryStr: getQueryStr
}
