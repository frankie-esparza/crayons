// TODO
// Pagination middleware
module.exports = {
    paginationHandler: function (err, req, res, next) {
        let page = req.query.page || 1;
        let size = req.query.size || 10;
        let limit;
        let offset;

        if (page > 0 && size > 0 && size <= maxResultsPerPage) {
            limit = size;
            offset = size * (page - 1);
        } else {
            errorResult.errors.push('Requires valid page and size params');
        }
    }
}
