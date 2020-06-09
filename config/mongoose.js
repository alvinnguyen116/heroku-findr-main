/**
 * @param mongoose
 * @param DB_URI
 * @desc Given a mongoose object and the database uri,
 * connect and setup some configs.
 */
export default function config({mongoose, DB_URI}) {
    mongoose.set('runValidators', true);
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
}
