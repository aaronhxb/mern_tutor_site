const errorHandler = (err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || "Something is wrong"
    res.status(status)

    res.json({ message })
}

module.exports = errorHandler