function authenticateUser(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // User is authenticated, proceed to the next middleware or API handler
    next();
}

module.exports = { authenticateUser };