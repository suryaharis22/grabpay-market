// pages/api/products.js
import { products, packages, providers } from '../../data/products';

export default function handler(req, res) {
    const { page = 1, per_page = 10, sortBy = 'title', order = 'asc', search = '', packages: packageFilter = '', min_price, max_price } = req.query;
    let filteredProducts = products;

    // Join products with packages and providers
    filteredProducts = filteredProducts.map(product => {
        const productPackage = packages.find(pkg => pkg.id === product.id_package);
        const provider = productPackage ? providers.find(prov => prov.id === productPackage.id_provider) : null;
        return { ...product, package: productPackage, provider: provider };
    });

    // Handle multiple search terms
    if (search) {
        const searchTerms = search.toLowerCase().split(' ');
        filteredProducts = filteredProducts.filter(product =>
            searchTerms.every(term => product.title.toLowerCase().includes(term))
        );
    }

    // Handle multiple packages
    if (packageFilter) {
        const packagesList = packageFilter.split(',');
        filteredProducts = filteredProducts.filter(product =>
            packagesList.includes(product.package.name)
        );
    }

    // Filter by price range
    const minPrice = min_price !== undefined && min_price !== '' ? parseFloat(min_price) : 0;
    const maxPrice = max_price !== undefined && max_price !== '' ? parseFloat(max_price) : Infinity;
    filteredProducts = filteredProducts.filter(product =>
        product.price >= minPrice && product.price <= maxPrice
    );

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const aValue = sortBy.includes('.') ? sortBy.split('.').reduce((o, i) => o[i], a) : a[sortBy];
        const bValue = sortBy.includes('.') ? sortBy.split('.').reduce((o, i) => o[i], b) : b[sortBy];

        if (order === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });


    // Paginate products
    const paginatedProducts = sortedProducts.slice((page - 1) * per_page, page * per_page);

    res.status(200).json({
        body: paginatedProducts,
        meta: {
            page: parseInt(page),
            per_page: parseInt(per_page),
            page_count: Math.ceil(filteredProducts.length / per_page),
            total: filteredProducts.length,
        },
    });
}
