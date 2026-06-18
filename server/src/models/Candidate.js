import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    resume_url: { type: String, required: true },
    parsed_resume_json: { type: Object, default: null },
    match_score: { type: Number, default: null },

matched_skills: {
  type: [String],
  default: [],
},

missing_skills: {
  type: [String],
  default: [],
},

status: {
  type: String,
  default: "applied",
},
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Candidate = mongoose.model("Candidate", candidateSchema);
