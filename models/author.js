var mongoose = require("mongoose");
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxlength: 100 },
  family_name: { type: String, required: true, maxlength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  return this.family_name + ", " + this.first_name;
});

// Virtual for author's date of birth formatted to be used in update
AuthorSchema.virtual("date_of_birth_formatted_for_update").get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toISODate();
});

// Virtual for author's date of death formatted to be used in update
AuthorSchema.virtual("date_of_death_formatted_for_update").get(function () {
  return DateTime.fromJSDate(this.date_of_death).toISODate();
});

// Virtual for author's lifespan
AuthorSchema.virtual("lifespan").get(function () {
  return (
    this.date_of_death.getYear() - this.date_of_birth.getYear()
  ).toString();
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});

// Virtual for author's lifespan formatted
AuthorSchema.virtual("lifespan_string").get(function () {
  const formatted_birth = this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "";
  const formatted_death = this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "";

  return this.date_of_birth
    ? `🟊 ${formatted_birth} - ${formatted_death ? "🕇 " : ""}${formatted_death}`
    : "Unknown";
});

//Export model
module.exports = mongoose.model("Author", AuthorSchema);
