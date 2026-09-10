declare module "heic-convert" {
  type ConvertOptions = { buffer: ArrayBuffer | Uint8Array | Buffer; format: "JPEG" | "PNG"; quality?: number };
  export default function convert(options: ConvertOptions): Promise<Buffer>;
}
