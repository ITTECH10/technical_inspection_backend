const AppError = require('./appError');

// exports.uploadProfileImage = req => {
//     const ext = req.files.photo.mimetype.split('/')[1];
//     const filename = `user-${req.user._id}-${new Date().getTime() * 1000}.${ext}`;

//     if (!req.files.photo.mimetype.startsWith('image')) {
//         return next(new AppError('Invalid file type. Please upload only images.', 400))

//     }   else if(req.files.photo.mimetype !== 'image/jpeg' && req.files.photo.mimetype !== 'image/png') {
//         return next(new AppError('Please provide an image type with jpg or png file extension.', 400));
//     } 

//     let temp = req.files.photo.tempFilePath.split('\\')
//     let index = temp.length - 1;
//     temp.splice(index, 1, req.files.filename)
//     let joinedTemp = temp.join('\\')

//     req.files.photo.mv(joinedTemp +filename, (err) => {
//         if(err) console.log(err)
//     })

//     req.files.filename = filename
//     req.files.joinedTemp = joinedTemp + filename
// }

exports.uploadSingleImage = req => {
    const ext = req.files.photo.mimetype.split('/')[1];
    const filename = `user-${req.user._id}-${new Date().getTime() * 1000}.${ext}`;

    if (!req.files.photo.mimetype.startsWith('image')) {
        return next(new AppError('Invalid file type. Please upload only images.', 400))

    } else if (req.files.photo.mimetype !== 'image/jpeg' && req.files.photo.mimetype !== 'image/png') {
        return next(new AppError('Please provide an image type with jpg or png file extension.', 400));
    }

    let temp = req.files.photo.tempFilePath.split('\\')
    let index = temp.length - 1;
    temp.splice(index, 1, req.files.filename)
    let joinedTemp = temp.join('\\')

    req.files.photo.mv(joinedTemp + filename, (err) => {
        if (err) console.log(err)
    })

    req.files.filename = filename
    req.files.joinedTemp = joinedTemp + filename
}

exports.uploadMultipleImages = req => {
    let files = []

    req.files.photo.map(p => {
        const ext = p.mimetype.split('/')[1];
        const filename = `user-${req.user._id}-${Math.random() * 1000000}.${ext}`;

        if (!p.mimetype.startsWith('image')) {
            return next(new AppError('Invalid file type. Please upload only images.', 400))
        }

        if (p.mimetype !== 'image/jpeg' && p.mimetype !== 'image/png') {
            return next(new AppError('Please provide an image type with jpg or png file extension.', 400));
        }

        let joinedTemp = p.tempFilePath
        files.push(p.tempFilePath)

        // p.mv(joinedTemp, +filename, (err) => {
        //     if (err) console.log(err)
        // })

        req.files.filename = filename
        req.files.joinedTemp = joinedTemp + filename
        req.files.photos = files
    })
}