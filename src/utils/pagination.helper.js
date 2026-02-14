/**
 * Pagination Helper — extracts pagination params from req.query
 * and provides a standardized metadata builder.
 *
 * Usage:
 *   const { page, limit, skip, sortBy, sortOrder, search } = getPaginationParams(req);
 *   const pagination = buildPaginationMeta(total, page, limit);
 */

const getPaginationParams = (req) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    return { page, limit, skip, search, sortBy, sortOrder };
};

const buildPaginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};

module.exports = { getPaginationParams, buildPaginationMeta };
