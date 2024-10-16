**Serverless DNS Worker**

This Cloudflare Worker acts as a serverless DNS proxy, redirecting all DNS queries to Cloudflare's DNS-over-HTTPS (DoH) service at 1.1.1.1.
**Features**

    DNS Query Proxying: Forwards DNS queries from clients to 1.1.1.1 via DNS-over-HTTPS (DoH).
    Logging: Logs request information, including the queried domain and response size.
    Cross-platform: Works from both web browsers and mobile devices.

Setup
**Prerequisites**

    Cloudflare Account: You'll need a Cloudflare account to create and deploy Workers.
    Cloudflare Worker: This Worker should be deployed via the Cloudflare Workers dashboard or the Wrangler CLI.

**Steps to Deploy**

    Create a new Worker on the Cloudflare dashboard 

    Paste the provided Worker code into your new worker's index.js file.

Deploy the Worker using the Wrangler CLI or via the Cloudflare dashboard:

Access the Worker by visiting the unique URL provided by Cloudflare (e.g., https://your-worker-name.workers.dev).

**Limitations**

    This worker only forwards raw DNS queries to 1.1.1.1. It does not include any form of caching or validation of DNS requests.
    Ensure that the DNS query is properly base64-encoded.
    Make sure that DNS queries from mobile devices are properly formatted as this worker supports cross-platform requests.

