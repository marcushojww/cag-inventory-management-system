function covertPriceToTwoDecimalPoints(price) {
  return parseFloat(price.toFixed(2));
}

function convertStringPriceToFloat(price) {
  let priceFloat = parseFloat(price);
  return parseFloat(priceFloat.toFixed(2));
}

module.exports = {
  covertPriceToTwoDecimalPoints,
  convertStringPriceToFloat,
};
