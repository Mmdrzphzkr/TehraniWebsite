const normalizeNumber = (value: string): number => {
  const normalized = value
    .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit).toString())
    .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit).toString());

  return parseInt(normalized, 10);
};

export default normalizeNumber;