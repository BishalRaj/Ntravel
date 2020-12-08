const app = require("./index");
const port = process.env.port || 8080;
app.listen(port, (err) => {
  if (err) {
    return console.log("ERROR: ", err);
  }
  console.log(`Listening at port: ${port}`);
});
