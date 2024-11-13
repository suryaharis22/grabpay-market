import { providers } from "@/data/products";


export default function handler(req, res) {
    const { page = 1, per_page = 10, search = '' } = req.query;
    let filteredProviders = providers;

    // Search by provider name
    if (search) {
        filteredProviders = filteredProviders.filter(provider =>
            provider.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    const paginatedProviders = filteredProviders.slice((page - 1) * per_page, page * per_page);

    res.status(200).json({
        body: paginatedProviders,
        meta: {
            page: parseInt(page),
            per_page: parseInt(per_page),
            page_count: Math.ceil(filteredProviders.length / per_page),
            total: filteredProviders.length,
        },
    });
}
