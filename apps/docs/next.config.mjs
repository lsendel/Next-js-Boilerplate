import nextra from 'nextra'

export default nextra({
  latex: true,
  search: {
    codeblocks: true
  }
})({
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
})
