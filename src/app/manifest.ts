import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Satark | Cyber Safety",
    short_name: "Satark",
    description:
      "Instant, privacy-first threat analysis for digital scams in India.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#00f0ff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
