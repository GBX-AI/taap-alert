/** GitHub Pages serves from /<repo>, so the app is built as a static export
 *  under a basePath. Set NEXT_PUBLIC_BASE_PATH="" for root-domain hosting. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
export default {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};
