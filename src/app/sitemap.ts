// Sitemap generation - Generate sitemap.xml
// Lists all public pages for SEO
export default function sitemap() {
    return [
        {
            url: 'https://workflowos.com',
            lastModified: new Date(),
        },
        {
            url: 'https://workflowos.com/pricing',
            lastModified: new Date(),
        },
        // More URLs...
    ];
}
