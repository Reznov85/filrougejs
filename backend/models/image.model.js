import mongoose from 'mongoose';
const imageSchema = new mongoose.Schema({
nom: {
type: String,
required: true
},
alt: {
type: String
}
}, { timestamps: true });
export default mongoose.model('Image', imageSchema);