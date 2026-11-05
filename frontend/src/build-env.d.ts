declare const __APP_VERSION__: string;
declare const __APP_BUILD__: number;

/** Vite turns an imported image into its hashed URL (components/world/worldArt.ts). */
declare module '*.webp' {
  const src: string;
  export default src;
}
