import { Options } from "$fresh/plugins/twind.ts";
import { apply } from "twind";

export default {
  selfURL: import.meta.url,
  theme: {
    extend: {
      fontFamily: {
        sans: "Familjen Grotesk",
        "familjen-grotesk": "Familjen Grotesk",
      },
      colors: {
        primary: "#ffffff",
        secondary: "#3f72a0",
      },
      keyframes: {
        type: {
          "0%": { width: "0ch" },
          "5%, 10%": { width: "1ch" },
          "15%, 20%": { width: "2ch" },
          "25%, 30%": { width: "3ch" },
          "35%, 40%": { width: "4ch" },
          "45%, 50%": { width: "5ch" },
          "55%, 60%": { width: "6ch" },
          "65%, 70%": { width: "7ch" },
          "75%, 80%": { width: "8ch" },
          "85%, 90%": { width: "9ch" },
          "95%": { width: "10ch" },
        },
        wiggle: {
          "0%, 100%": {
            transform: "rotate(-3deg)",
          },
          "50%": {
            transform: "rotate(3deg)",
          },
        },
        "wiggle-more": {
          "0%, 100%": {
            transform: "rotate(-12deg)",
          },
          "50%": {
            transform: "rotate(12deg)",
          },
        },
        "rotate-y": {
          "0%": {
            transform: "rotateY(360deg)",
          },
          "100%": {
            transform: "rotateY(0)",
          },
        },
        "rotate-x": {
          "0%": {
            transform: "rotateX(360deg)",
          },
          "100%": {
            transform: "rotateX(0)",
          },
        },
        jump: {
          "0%, 100%": {
            transform: "scale(100%)",
          },
          "10%": {
            transform: "scale(80%)",
          },
          "50%": {
            transform: "scale(120%)",
          },
        },
        "jump-in": {
          "0%": {
            transform: "scale(0%)",
          },
          "80%": {
            transform: "scale(120%)",
          },
          "100%": {
            transform: "scale(100%)",
          },
        },
        "jump-out": {
          "0%": {
            transform: "scale(100%)",
          },
          "20%": {
            transform: "scale(120%)",
          },
          "100%": {
            transform: "scale(0%)",
          },
        },
        shake: {
          "0%": {
            transform: "translateX(0rem)",
          },
          "25%": {
            transform: "translateX(-1rem)",
          },
          "75%": {
            transform: "translateX(1rem)",
          },
          "100%": {
            transform: "translateX(0rem)",
          },
        },
        fade: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "fade-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-2rem)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(2rem)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-left": {
          "0%": {
            opacity: "0",
            transform: "translateX(2rem)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "fade-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(-2rem)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "flip-up": {
          "0%": {
            transform: "rotateX(90deg)",
            transformOrigin: "bottom",
          },
          "100%": {
            transform: "rotateX(0)",
            transformOrigin: "bottom",
          },
        },
        "flip-down": {
          "0%": {
            transform: "rotateX(-90deg)",
            transformOrigin: "top",
          },
          "100%": {
            transform: "rotateX(0)",
            transformOrigin: "top",
          },
        },
      },
      animation: {
        cursor: "cursor .6s linear infinite alternate",
        type: "type 1.8s ease-out .8s 1 normal both",
        "type-reverse": "type 1.8s ease-out 0s infinite alternate-reverse both",

        wiggle: "wiggle 1s both",
        "wiggle-more": "wiggle-more 1s both",
        "rotate-y": "rotate-y 1s both",
        "rotate-x": "rotate-x 1s both",
        jump: "jump .5s both",
        "jump-in": "jump-in .5s both",
        "jump-out": "jump-out .5s both",
        shake: "shake .5s both",
        fade: "fade 1s both",
        "fade-down": "fade-down 1s both",
        "fade-up": "fade-up 1s both",
        "fade-left": "fade-left 1s both",
        "fade-right": "fade-right 1s both",
        "flip-up": "flip-up 1s both",
        "flip-down": "flip-down 1s both",
      },
    },
  },
  preflight: {
    "@import":
      `url('https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&display=swap')`,
    body: apply`m-0 p-8 h-screen text-primary bg-secondary`,
  },
} satisfies Options;
