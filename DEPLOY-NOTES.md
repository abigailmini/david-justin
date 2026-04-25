# DEPLOY NOTES — david-justin

## ⛔ DO NOT TOUCH
- `#nav-hamburger` button: NEVER add `display:'flex'` or `display` to its inline style. The CSS `#nav-hamburger { display:none }` hides it on desktop, and `@media (max-width:768px)` shows it on mobile. Any inline display property OVERRIDES the CSS and breaks desktop layout.

## Deploy to SiteGround
scp -o StrictHostKeyChecking=no -i ~/.ssh/david-justin-siteground -P 18765 <file> u104-33u5354ncgkw@gsgpm1075.siteground.biz:~/www/david-justin.com/public_html/<file>
