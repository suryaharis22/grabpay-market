// pages/api/packages.js
import { packages } from '../../data/products';
import { providers } from '../../data/products';

export default function handler(req, res) {
    const { page = 1, per_page = 10, search = '', provider_name = '', sortBy, order } = req.query;
    let filteredPackages = packages;

    // Join packages with provider details
    filteredPackages = filteredPackages.map(pkg => {
        const provider = providers.find(prov => prov.id === pkg.id_provider);
        return { ...pkg, provider: provider };
    });

    // Handle multiple search terms
    if (search) {
        const searchTerms = search.toLowerCase().split('|');
        filteredPackages = filteredPackages.filter(pkg =>
            searchTerms.every(term => pkg.name.toLowerCase().includes(term) || pkg.prefix_code.toLowerCase().includes(term) || (pkg.provider && pkg.provider.name.toLowerCase().includes(term)))
        );
    }

    // Handle multiple providers
    if (provider_name) {
        const providerNames = provider_name.split(',');
        filteredPackages = filteredPackages.filter(pkg => providerNames.includes(pkg.provider.name));
    }

    // Sort by specific column, including nested properties like provider.name
    if (sortBy && order) {
        filteredPackages = filteredPackages.sort((a, b) => {
            const aValue = sortBy.split('.').reduce((o, i) => o[i], a);
            const bValue = sortBy.split('.').reduce((o, i) => o[i], b);

            if (order === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }

    // Paginate results
    const paginatedPackages = filteredPackages.slice((page - 1) * per_page, page * per_page);

    res.status(200).json({
        body: paginatedPackages,
        meta: {
            page: parseInt(page),
            per_page: parseInt(per_page),
            page_count: Math.ceil(filteredPackages.length / per_page),
            total: filteredPackages.length,
        },
    });
}
