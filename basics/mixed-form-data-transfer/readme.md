
When you send **multipart/form-data** (whether from a `<form enctype="multipart/form-data">` or using `FormData` in JavaScript), **Express will not populate `req.body` automatically**.

👉 Why?
Because Express’s default body parsers (`express.json()` and `express.urlencoded()`) only understand:

* `application/json`
* `application/x-www-form-urlencoded`

But **multipart/form-data** contains both text fields and file streams separated by boundaries. That’s why `req.body` ends up **empty** unless you use something like `multer`, `busboy`, or manually parse the stream yourself.

---

So:

* ✅ If you send JSON → `req.body` works.
* ✅ If you send URL-encoded data → `req.body` works.
* ❌ If you send multipart/form-data → `req.body` does **not** work (unless a parser is used).

---

Since you said you don’t want to use **multer**, you’ll need to:

1. Read from the request stream (`req.on('data', ...)`).
2. Split the incoming buffer on the **boundary**.
3. Extract fields (username, email, etc.) from text parts.
4. Pipe the file part into a `fs.createWriteStream()`.

---
