type EncoderModule = {
  encode: (data: BufferSource, width: number, height: number, options: object) => Uint8Array;
};

type EmscriptenFactory = (options?: Record<string, unknown>) => Promise<EncoderModule> | EncoderModule;

function exactBytes(view: Uint8Array): ArrayBuffer {
  return view.slice().buffer;
}

let jpegModule: Promise<EncoderModule> | null = null;
let webpModule: Promise<EncoderModule> | null = null;
let pngReady: Promise<{
  optimise: (data: Uint8Array, level: number, interlace: boolean, optimiseAlpha: boolean) => Uint8Array;
}> | null = null;

async function loadJpeg(): Promise<EncoderModule> {
  jpegModule ??= (async () => {
    const [{ default: factory }, { initEmscriptenModule }] = await Promise.all([
      import("@jsquash/jpeg/codec/enc/mozjpeg_enc.js") as Promise<{ default: EmscriptenFactory }>,
      import("@jsquash/jpeg/utils.js") as Promise<{
        initEmscriptenModule: (factory: EmscriptenFactory) => Promise<EncoderModule>;
      }>,
    ]);
    return initEmscriptenModule(factory);
  })();
  return jpegModule;
}

async function jpegDefaults(): Promise<object> {
  const meta = await import("@jsquash/jpeg/meta.js");
  return meta.defaultOptions;
}

async function webpDefaults(): Promise<object> {
  const meta = await import("@jsquash/webp/meta.js");
  return meta.defaultOptions;
}

async function loadWebp(): Promise<EncoderModule> {
  webpModule ??= (async () => {
    const [{ initEmscriptenModule }, simdModule] = await Promise.all([
      import("@jsquash/webp/utils.js") as Promise<{
        initEmscriptenModule: (factory: EmscriptenFactory) => Promise<EncoderModule>;
      }>,
      import("wasm-feature-detect") as Promise<{ simd: () => Promise<boolean> }>,
    ]);
    const simd = await simdModule.simd().catch(() => false);
    const encoder = simd
      ? await (import("@jsquash/webp/codec/enc/webp_enc_simd.js") as Promise<{ default: EmscriptenFactory }>)
      : await (import("@jsquash/webp/codec/enc/webp_enc.js") as Promise<{ default: EmscriptenFactory }>);
    return initEmscriptenModule(encoder.default);
  })();
  return webpModule;
}

async function loadPng() {
  pngReady ??= (async () => {
    const png = await (import("@jsquash/oxipng/codec/pkg/squoosh_oxipng.js") as Promise<{
      default: (moduleOrPath?: unknown) => Promise<unknown>;
      optimise: (data: Uint8Array, level: number, interlace: boolean, optimiseAlpha: boolean) => Uint8Array;
    }>);
    await png.default();
    return { optimise: png.optimise };
  })();
  return pngReady;
}

export async function encodeMozjpeg(image: ImageData, quality: number): Promise<ArrayBuffer | null> {
  try {
    const module = await loadJpeg();
    const view = module.encode(image.data, image.width, image.height, {
      ...(await jpegDefaults()),
      quality: Math.round(quality),
      chroma_quality: Math.round(quality),
    });
    if (!view || view.byteLength < 4) return null;
    return exactBytes(view);
  } catch {
    return null;
  }
}

export async function encodeLibwebp(image: ImageData, quality: number): Promise<ArrayBuffer | null> {
  try {
    const module = await loadWebp();
    const view = module.encode(image.data, image.width, image.height, {
      ...(await webpDefaults()),
      quality: Math.round(quality),
    });
    if (!view || view.byteLength < 4) return null;
    return exactBytes(view);
  } catch {
    return null;
  }
}

export async function optimisePng(bytes: ArrayBuffer): Promise<ArrayBuffer | null> {
  try {
    const png = await loadPng();
    const view = png.optimise(new Uint8Array(bytes), 2, false, true);
    if (!view || view.byteLength < 8) return null;
    return exactBytes(view);
  } catch {
    return null;
  }
}
