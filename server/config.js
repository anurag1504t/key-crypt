module.exports = {
    'mongoUri' : process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/?compressors=zlib&readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass&ssl=false"
}