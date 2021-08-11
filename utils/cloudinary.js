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

// DEVELOPMENT
// exports.uploadSingleImage = req => {
//     const ext = req.files.photo.mimetype.split('/')[1];
//     const filename = `user-${req.user._id}-${new Date().getTime() * 1000}.${ext}`;

//     if (!req.files.photo.mimetype.startsWith('image')) {
//         return next(new AppError('Invalid file type. Please upload only images.', 400))

//     } else if (req.files.photo.mimetype !== 'image/jpeg' && req.files.photo.mimetype !== 'image/png') {
//         return next(new AppError('Please provide an image type with jpg or png file extension.', 400));
//     }

//     let temp = req.files.photo.tempFilePath.split('\\')
//     let index = temp.length - 1;
//     temp.splice(index, 1, req.files.filename)
//     let joinedTemp = temp.join('\\')

//     req.files.photo.mv(joinedTemp + filename, (err) => {
//         if (err) console.log(err)
//     })

//     req.files.filename = filename
//     req.files.joinedTemp = joinedTemp + filename
// }

// PRODUCTION
exports.uploadSingleImage = req => {
    const ext = req.files.photo.mimetype.split('/')[1];
    const filename = `user-${req.user._id}-${new Date().getTime() * 1000}.${ext}`;

    if (!req.files.photo.mimetype.startsWith('image')) {
        return next(new AppError('Invalid file type. Please upload only images.', 400))

    } else if (req.files.photo.mimetype !== 'image/jpeg' && req.files.photo.mimetype !== 'image/png') {
        return next(new AppError('Please provide an image type with jpg or png file extension.', 400));
    }

    let temp = req.files.photo.tempFilePath.split('/')
    let index = temp.length - 1;
    temp.splice(index, 1, req.files.filename)
    let joinedTemp = temp.join('/')

    req.files.photo.mv(joinedTemp + filename, (err) => {
        if (err) console.log(err)
    })

    req.files.filename = filename
    req.files.joinedTemp = joinedTemp + filename
}

exports.uploadMultipleImages = req => {
    const oldTempFiles = []
    const newTempFiles = []
    let ext
    let filename

    req.files.photo.map((p) => {
        ext = p.mimetype.split('/')[1];
        filename = `user-${req.user._id}-PLACEHOLDER.${ext}`;

        if (!p.mimetype.startsWith('image')) {
            return next(new AppError('Invalid file type. Please upload only images.', 400))
        }

        if (p.mimetype !== 'image/jpeg' && p.mimetype !== 'image/png') {
            return next(new AppError('Please provide an image type with jpg or png file extension.', 400));
        }
        
        oldTempFiles.push(p.tempFilePath)
    })

    oldTempFiles.map((tf, i) => {
        const tempDirectory = tf.split('\\')
        const index = tempDirectory.length - 1
        const newFilename = filename.replace('PLACEHOLDER', i)
        
        tempDirectory.splice(index, 1, newFilename)

        const newTempDirectory = tempDirectory.join('\\')
        
        req.files.photo.map(p => {
            p.mv(newTempDirectory, (err) => {
                if(err) console.log(err)
            })
        })

        const finalTempFiles = newTempDirectory

        newTempFiles.push(finalTempFiles)
    })

    req.files.photos = newTempFiles
}