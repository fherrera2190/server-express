const { productService } = require("../../services/index.service");
const CustomError = require("../../utils/CustomErrors/CustomError");
const EErrors = require("../../utils/CustomErrors/EErrors");
const { generateProductErrorInfo } = require("../../utils/CustomErrors/info");

module.exports = async (req, res) => {
  try {
    const { title, description, price, code, stock, category } = req.body;
    if (!title || !description || !price || !code || !stock || !category) {
      CustomError.createError({
        name: "Error Creating Product",
        cause: generateProductErrorInfo({
          title,
          description:description.toString(),
          code,
          price,
          stock,
          category
        }),
        message: "Error to create a product",
        code: EErrors.INVALID_TYPE_ERROR
      });
    }
    const productos = await productService.create(req.body);
    req.io.emit("actualizarProductos", productos);
    return res.sendSuccess(productos);
  } catch (error) {
    console.log(error.cause)
    return res.sendServerError(error.message);
  }
};
