module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/bingo-sheet-file-generator/"
      : "/",
};
