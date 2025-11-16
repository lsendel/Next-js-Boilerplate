# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - heading "Sign in to your account" [level=2] [ref=e6]
      - paragraph [ref=e7]: Test Mode Authentication
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]:
          - generic [ref=e11]: Email
          - textbox "Email" [ref=e12]
        - generic [ref=e13]:
          - generic [ref=e14]: Password
          - textbox "Password" [ref=e15]
      - button "Sign In" [ref=e17]
      - paragraph [ref=e19]:
        - text: Don't have an account?
        - link "Sign up" [ref=e20] [cursor=pointer]:
          - /url: /sign-up
  - link "Demo of Next.js Boilerplate" [ref=e22] [cursor=pointer]:
    - /url: https://github.com/ixartz/Next-js-Boilerplate
    - generic [ref=e23]: Demo of Next.js Boilerplate
  - button "Open Next.js Dev Tools" [ref=e29] [cursor=pointer]:
    - generic [ref=e32]:
      - text: Compiling
      - generic [ref=e33]:
        - generic [ref=e34]: .
        - generic [ref=e35]: .
        - generic [ref=e36]: .
  - alert [ref=e37]
```