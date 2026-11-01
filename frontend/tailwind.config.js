/** @type {import('tailwindcss').Config} */
// 破茧品牌配色：取自《视觉规范与接入说明.md》颜色建议
// 主紫 #5D56CB · 深夜蓝紫 #3D3AA5 · 中紫 #766FE4 · 柔紫 #9893F5 · 浅紫 #BAACF9 · 近白紫 #E4D4FA
const brand = {
  50: "#F7F2FE",
  100: "#E4D4FA",
  200: "#D5C3FA",
  300: "#BAACF9",
  400: "#9893F5",
  500: "#766FE4",
  600: "#5D56CB",
  700: "#4B44B5",
  800: "#3D3AA5",
  900: "#2E2C7E",
  950: "#1F1E57",
};

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand,
        // 把旧的 indigo / violet 主题整体替换为品牌紫，全站既有组件无需逐处修改
        indigo: brand,
        violet: brand,
        ink: {
          title: "#29265F",
          body: "#37345F",
          muted: "#77739B",
        },
      },
      boxShadow: {
        // 规范定义：柔和阴影
        card: "0 12px 40px rgba(55, 45, 130, 0.14)",
        "card-hover":
          "0 16px 48px rgba(55, 45, 130, 0.20)",
        button: "0 8px 24px rgba(93, 86, 203, 0.28)",
        pop: "0 12px 32px rgba(93, 86, 203, 0.22)",
      },
      borderRadius: {
        card: "24px",
        control: "14px",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(64% 48% at 50% 0%, rgba(118, 111, 228, 0.16), transparent 70%)",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
