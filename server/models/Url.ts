import mongoose from "mongoose";


export type UrlDocument = mongoose.Document & {
    id:string;
    url:string;
    visitors:number,
    timestamp:true
};
const urlSchema = new mongoose.Schema<UrlDocument>({
  id: {
    type: String,
    required: "ID is required!"
  },
  url: {
    type: String,
    required: "URL is required!"
  },
  visitors: {
    type: Number,
    required: "Visits on this url!"
  }
}, {
  timestamps: true
});

//module.exports = mongoose.model('Url', urlSchema);

export const Url = mongoose.model<UrlDocument>("Url", urlSchema);
