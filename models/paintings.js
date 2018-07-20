const mongoose = require("mongoose");
const Schema   = mongoose.Schema;




const paintingSchema = new Schema({
  title: String,
  artist: String,
  description: String,
  buyPrice: Number,
  longtermLease: Boolean,
  monthlyPrice: Number,
  imgPath: String,
}, {
  timestamps: true
});


const Painting = mongoose.model("Painting", paintingSchema);



module.exports = Painting;