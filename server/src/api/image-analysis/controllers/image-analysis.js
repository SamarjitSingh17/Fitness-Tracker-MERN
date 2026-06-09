const { analyzeImage } = require("../services/gemini");

module.exports = {
  async analyze(ctx) {
    const file = ctx.request.files?.image;
    if (!file) {
      return ctx.badRequest("No Image uploaded");
    }
    const filePath = file.filepath;
    try {
      const result = await analyzeImage(filePath);
      return ctx.send({
        success: true,
        result,
      });
    } catch (error) {
      console.error("Image-analysis error:", error);
      return ctx.internalServerError("Analysis failed", {
        error: error.message || error,
      });
    }
  },
};
