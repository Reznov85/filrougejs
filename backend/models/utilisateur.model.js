
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const utilisateurSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    nom: {
      type: String,
      required: true
    },
    prenom: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    avatar: {
      type: String,
      required: false
    },
    animes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Anime'
    }]
}, { timestamps: true });

utilisateurSchema.pre("save", async function(){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10)
  }
})

utilisateurSchema.pre("findOneAndUpdate", async function () {
  let update = this.getUpdate();

  if (update.password) {
    const hashed = await bcrypt.hash(update.password, 10);

    this.setUpdate({
      ...update,
      password: hashed
    });
  }
})

export default mongoose.model('Utilisateur', utilisateurSchema);
