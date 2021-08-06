const AppError = require('./appError');

exports.uploadProfileImage = req => {
    const ext = req.files.photo.mimetype.split('/')[1];
    const filename = `user-${req.user._id}-${new Date().getTime() * 1000}.${ext}`;
    
    if (!req.files.photo.mimetype.startsWith('image')) {
        return next(new AppError('Invalid file type. Please upload only images.', 400))

    }   else if(req.files.photo.mimetype !== 'image/jpeg' && req.files.photo.mimetype !== 'image/png') {
        return next(new AppError('Please provide an image type with jpg or png file extension.', 400));
    } 

    let temp = req.files.photo.tempFilePath.split('\\')
    let index = temp.length - 1;
    temp.splice(index, 1, req.files.filename)
    let joinedTemp = temp.join('\\')

    req.files.photo.mv(joinedTemp +filename, (err) => {
        if(err) console.log(err)
    })

    req.files.filename = filename
    req.files.joinedTemp = joinedTemp + filename
}