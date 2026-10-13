function errorMiddleware(err, req, res, next){
    console.log("Error", err);

     if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: err.message
        });
    }
     if (err.message === 'Invalid or expired refresh token') {
        return res.status(401).json({
            message: err.message
        });
    }

    if (err.code === 11000) {
    return res.status(409).json({
        message: 'Email already exists'
    });
}

    res.status(500).json({
        message:"Something went wrong!"
    })
};

module.exports = errorMiddleware;