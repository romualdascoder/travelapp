const router = require("express").Router();
const Pin = require("../models/Pin");

router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  await Pin.findByIdAndDelete(id, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.send();
      console.log("Deleted : ", docs);
    }
  });
});

module.exports = router;
