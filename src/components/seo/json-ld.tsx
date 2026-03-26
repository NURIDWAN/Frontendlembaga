/**
 * Reusable JSON-LD Structured Data components for SEO.
 * Supports: Organization, WebSite, Article, BreadcrumbList
 */

interface JsonLdProps {
    data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

// --- WebSite Schema ---

interface WebSiteJsonLdProps {
    name: string;
    url: string;
    searchUrl?: string;
}

export function WebSiteJsonLd({ name, url, searchUrl }: WebSiteJsonLdProps) {
    const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name,
        url,
    };

    if (searchUrl) {
        data.potentialAction = {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: searchUrl,
            },
            'query-input': 'required name=search_term_string',
        };
    }

    return <JsonLd data={data} />;
}

// --- Article Schema ---

interface ArticleJsonLdProps {
    title: string;
    url: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
    authorName?: string;
    publisherName: string;
    publisherLogo?: string;
    description?: string;
}

export function ArticleJsonLd({
    title,
    url,
    image,
    datePublished,
    dateModified,
    authorName,
    publisherName,
    publisherLogo,
    description,
}: ArticleJsonLdProps) {
    const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        url,
        datePublished,
        dateModified: dateModified || datePublished,
        publisher: {
            '@type': 'Organization',
            name: publisherName,
            ...(publisherLogo
                ? { logo: { '@type': 'ImageObject', url: publisherLogo } }
                : {}),
        },
    };

    if (image) data.image = image;
    if (authorName) {
        data.author = { '@type': 'Person', name: authorName };
    }
    if (description) data.description = description;

    return <JsonLd data={data} />;
}

// --- BreadcrumbList Schema ---

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbJsonLdProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return <JsonLd data={data} />;
}
