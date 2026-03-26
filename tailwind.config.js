export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                surface: "rgb(var(--surface) / <alpha-value>)",
                canvas: "rgb(var(--canvas) / <alpha-value>)",
                ink: "rgb(var(--ink) / <alpha-value>)",
                muted: "rgb(var(--muted) / <alpha-value>)",
                accent: "rgb(var(--accent) / <alpha-value>)",
                accent2: "rgb(var(--accent-2) / <alpha-value>)",
            },
            boxShadow: {
                soft: "0 20px 40px rgba(9, 30, 66, 0.10)",
            },
            borderRadius: {
                "4xl": "2rem",
            },
            fontFamily: {
                sans: ["var(--font-family)", "ui-sans-serif", "system-ui", "sans-serif"],
            },
        },
    },
    plugins: [],
};
