import express from 'express'
const app = express()
const port = 3000

app.use(
  jwt({
    secret: Buffer.from("REDACTED_ROTATE_THIS_SECRET", "base64"),
    algorithms: ["RS256"],
  }).unless({ path: ["/login"] })
);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Api available on port ${port}`)
})
