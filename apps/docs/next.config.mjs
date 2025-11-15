import nextra from 'nextra'

export default nextra({
  latex: true,
  search: {
    codeblocks: true
  }
})({
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
})
