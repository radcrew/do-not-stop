module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    // Add console error handling
    "no-console": ["error", { allow: ["warn", "error"] }],
  },
};
