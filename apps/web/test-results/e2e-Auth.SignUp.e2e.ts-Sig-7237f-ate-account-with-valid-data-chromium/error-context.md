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
          - textbox "Email" [ref=e12]: test-1763438123350-o5v1zo@example.com
        - generic [ref=e13]:
          - generic [ref=e14]: Password
          - textbox "Password" [ref=e15]:
            - /placeholder: Password (min 8 characters)
            - text: Test@Password123!
        - generic [ref=e16]:
          - generic [ref=e17]: Confirm Password
          - textbox "Confirm Password" [active] [ref=e18]:
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
    - generic [ref=e35]:
      - text: Compiling
      - generic [ref=e36]:
        - generic [ref=e37]: .
        - generic [ref=e38]: .
        - generic [ref=e39]: .
  - alert [ref=e40]
```