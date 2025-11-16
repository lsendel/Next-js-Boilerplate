# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - heading "Create your account" [level=2] [ref=e6]
      - paragraph [ref=e7]: Test Mode Authentication
    - generic [ref=e8]:
      - alert [ref=e9]: Passwords do not match
      - generic [ref=e10]:
        - generic [ref=e11]:
          - generic [ref=e12]: Email
          - textbox "Email" [ref=e13]: test@example.com
        - generic [ref=e14]:
          - generic [ref=e15]: Password
          - textbox "Password" [ref=e16]:
            - /placeholder: Password (min 8 characters)
            - text: testpassword123
        - generic [ref=e17]:
          - generic [ref=e18]: Confirm Password
          - textbox "Confirm Password" [ref=e19]:
            - /placeholder: Confirm password
            - text: different123
      - button "Sign Up" [ref=e21]
      - paragraph [ref=e23]:
        - text: Already have an account?
        - link "Sign in" [ref=e24] [cursor=pointer]:
          - /url: /sign-in
  - link "Demo of Next.js Boilerplate" [ref=e26] [cursor=pointer]:
    - /url: https://github.com/ixartz/Next-js-Boilerplate
    - generic [ref=e27]: Demo of Next.js Boilerplate
  - button "Open Next.js Dev Tools" [ref=e33] [cursor=pointer]:
    - img [ref=e34]
  - alert [ref=e37]
```