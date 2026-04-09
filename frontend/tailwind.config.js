export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                ink: "#0f172a",
                mist: "#e2e8f0",
                accent: "#0f766e",
                canvas: "#f8fafc",
            },
            boxShadow: {
                panel: "0 18px 50px rgba(15, 23, 42, 0.08)",
            },
        },
    },
    plugins: [],
};
