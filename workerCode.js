addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    const dnsRedirectTarget = 'https://1.1.1.1/dns-query'; // Cloudflare's DoH resolver

    // Check if the request is a DNS-over-HTTPS (DoH) request
    if (request.headers.get('content-type') === 'application/dns-message') {
        if (request.method === 'POST') {
            // Handle DNS-over-HTTPS via POST method
            const dnsRequestBody = await request.arrayBuffer();
            return forwardDnsQuery(dnsRedirectTarget, dnsRequestBody);
        } else if (request.method === 'GET' && url.searchParams.has('dns')) {
            // Handle DNS-over-HTTPS via GET method
            const dnsQueryBase64 = url.searchParams.get('dns');
            const dnsRequestBody = decodeBase64Url(dnsQueryBase64);
            if (!dnsRequestBody) {
                return new Response('Invalid DNS query format', { status: 400 });
            }
            return forwardDnsQuery(dnsRedirectTarget, dnsRequestBody);
        } else {
            return new Response('Invalid DNS request method', { status: 405 });
        }
    }

    // Handle regular web requests
    return new Response('This is a DNS-over-HTTPS service powered by Cloudflare Workers', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
    });
}

async function forwardDnsQuery(target, dnsRequestBody) {
    const response = await fetch(target, {
        method: 'POST',
        headers: { 'Content-Type': 'application/dns-message' },
        body: dnsRequestBody
    });
    const responseBody = await response.arrayBuffer();
    return new Response(responseBody, {
        status: response.status,
        headers: { 'Content-Type': 'application/dns-message' }
    });
}

// Optimized function to decode URL-safe base64
function decodeBase64Url(base64Url) {
    // Replace URL-safe characters and add padding
    const base64 = (base64Url + '==='.slice((base64Url.length % 4) || 4)).replace(/-/g, '+').replace(/_/g, '/');
    const binaryString = atob(base64);
    const byteNumbers = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        byteNumbers[i] = binaryString.charCodeAt(i);
    }
    return byteNumbers;
}
