const mongoose = require('mongoose');
const Addition = require('./addition');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
    vertical: {
        type: Boolean,
        default: false
    }  
});
ImageSchema.virtual('thumbnail').get(function() {
return this.url.replace('/upload', '/upload/w_200,h_200,c_fill');
});
ImageSchema.virtual('foredit').get(function() {
    return this.url.replace('/upload', '/upload/h_200,c_fill');
    });


ImageSchema.virtual('toHorizontal').get(function() {
    return this.url.replace('/upload', '/upload/w_700,h_500,c_pad,b_white')
    });

ImageSchema.virtual('icon').get(function() {
return this.url.replace('/upload', '/upload/w_150,h_150,c_fit')
});


const opts = {toJSON: {virtuals: true}};

const AnimalSchema = new Schema({
    title: String,
    images: [ ImageSchema ],
    avatar: ImageSchema,
    moderate: {
        type: String,
        enum: ["new", "edited", "ready"],
        default: "new"
    },
    geometry: {
        type:{
            type: String,
            enum: ["Point"],
            required: true
        },
         coordinates: {
             type: [Number],
             required: true
         }
    },
    status: String,
    description: String,
    areal: String,
     
    location: {
        type:String,
        default: "0"
    } ,
    source: String,
    map:{
        type: String,
        default: "https://www.google.com"
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    additions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Addition'
        }
    ]
}, opts)

AnimalSchema.virtual('properties.popupMarkup').get(function() {
    if(this.avatar) {
            return `<a href="/animals/${this._id}">
            <img src="${this.avatar.icon}" alt=${this.title}>
            </a>`;
    } else if(this.images.length > 0) {
    return `<a href="/animals/${this._id}">
    <img src="${this.images[0].icon}" alt=${this.title}>
   
    </a>`
    //   <h6>${this.title}</h6>
    } else {
        return `<a href="/animals/${this._id}">
        <img src="https://res.cloudinary.com/dswqbj1l9/image/upload/w_100,h_100,c_fit/v1647094132/WildAnimals/ndh184i6p88p9fjk02po.jpg" alt=${this.title}>
        <h6>${this.title}</h6>
        </a>`
    }
})

AnimalSchema.post("findOneAndDelete", async function (doc) {
    if(doc) {
        await Addition.deleteMany({
            _id: {
                $in: doc.additions
            }
        })
    }
})

module.exports = mongoose.model("Animal", AnimalSchema);