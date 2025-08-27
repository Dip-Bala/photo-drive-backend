import {model, Schema} from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required : true
    },
    password: {
        type: String, 
        required: true
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })

const folderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Folder'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

const imageSchema = new Schema(
    {
    name: { type: String, required: true }, 
    url: { type: String, required: true }, // path/Cloudinary/S3 URL
    folder: { type: Schema.Types.ObjectId, ref: "Folder" }, 
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
)
imageSchema.index({name: "text"});

export const UserModel = model('User', userSchema);
export const FolderModel = model('Folder', folderSchema);
export const ImageModel = model('Image', imageSchema);
