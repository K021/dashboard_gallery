import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-console": "off",  // 예시: 콘솔 경고 무시
      "no-unused-vars": "off",  // 예시: 사용되지 않은 변수 경고 무시
      "react/no-unused-vars": "off",  // React에서 사용되지 않는 변수 경고 무시
      "next/no-img-element": "off",  // img 태그 사용 경고 무시
      "next/next/no-html-link-for-pages": "off", // <a> 태그 사용 경고 무시
      "@typescript-eslint/no-explicit-any": "off", // any 타입 사용 경고 무시
    },
  },
];

export default eslintConfig;