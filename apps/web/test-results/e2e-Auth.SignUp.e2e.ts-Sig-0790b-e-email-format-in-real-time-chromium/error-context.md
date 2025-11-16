# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - heading "Create your account" [level=2] [ref=e6]
      - paragraph [ref=e7]: Test Mode Authentication
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]:
          - generic [ref=e11]: Email
          - textbox "Email" [ref=e12]: invalid-email
        - generic [ref=e13]:
          - generic [ref=e14]: Password
          - textbox "Password" [active] [ref=e15]:
            - /placeholder: Password (min 8 characters)
        - generic [ref=e16]:
          - generic [ref=e17]: Confirm Password
          - textbox "Confirm Password" [ref=e18]:
            - /placeholder: Confirm password
      - button "Sign Up" [ref=e20]
      - paragraph [ref=e22]:
        - text: Already have an account?
        - link "Sign in" [ref=e23] [cursor=pointer]:
          - /url: /sign-in
  - link "Demo of Next.js Boilerplate" [ref=e25] [cursor=pointer]:
    - /url: https://github.com/ixartz/Next-js-Boilerplate
    - generic [ref=e26]: Demo of Next.js Boilerplate
  - button "Open Next.js Dev Tools" [ref=e32] [cursor=pointer]:
    - img [ref=e33]
  - alert [ref=e36]
```