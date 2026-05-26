import express from "express";
import path from "path";
import fs from "fs";
import compression from "compression";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Response Compression for high performance (gzip)
  app.use(compression());

  // 2. Performance SEO: Response time monitoring logger (TTFB tracing)
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      if (duration > 500) {
        console.warn(`[SEO-PERF] Slow response detected: ${req.method} ${req.url} took ${duration}ms`);
      }
    });
    next();
  });

  // 3. Security SEO & Clean URLs (Redirect double slashes, force clean paths)
  app.use((req, res, next) => {
    // Basic Security Headers to boost SEO rating (HSTS and Mime sniff prevention)
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    if (process.env.NODE_ENV === "production" && req.headers["x-forwarded-proto"] === "http") {
      // Force HTTPS redirect on production to avoid duplicate HTTP/HTTPS index
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });

  // 4. XML Sitemap Generator
  app.get("/sitemap.xml", (req, res) => {
    const siteUrl = process.env.VITE_SITE_URL || `https://${req.headers.host || "www.nexvy.in"}`;
    const currentDate = new Date().toISOString().split("T")[0];

    // Priority site pages
    const routes = [
      { path: "/", priority: "1.0", changefreq: "daily" },
      { path: "/tasks", priority: "0.9", changefreq: "daily" },
      { path: "/quizzes", priority: "0.8", changefreq: "daily" },
      { path: "/shop-earn", priority: "0.8", changefreq: "daily" },
      { path: "/spinner", priority: "0.7", changefreq: "weekly" },
      { path: "/daily-gift", priority: "0.7", changefreq: "weekly" },
      { path: "/leaderboard", priority: "0.6", changefreq: "daily" },
      { path: "/referral", priority: "0.7", changefreq: "weekly" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    routes.forEach((route) => {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}${route.path}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml; charset=utf-8");
    res.header("Cache-Control", "public, max-age=86400"); // 24 hours client/edge cache
    res.send(xml);
  });

  // 5. Robots.txt Router
  app.get("/robots.txt", (req, res) => {
    const siteUrl = process.env.VITE_SITE_URL || `https://${req.headers.host || "www.nexvy.in"}`;
    const robots = [
      "User-agent: *",
      "Allow: /",
      "Allow: /tasks",
      "Allow: /quizzes",
      "Allow: /shop-earn",
      "Allow: /spinner",
      "Allow: /daily-gift",
      "Allow: /leaderboard",
      "Allow: /referral",
      "",
      "# Block admin area, private user panels, search duplication and APIs",
      "Disallow: /admin",
      "Disallow: /admin/*",
      "Disallow: /profile",
      "Disallow: /withdraw",
      "Disallow: /api/*",
      "Disallow: /*?*", // Avoid query-string-based duplicate index issues
      "",
      `Sitemap: ${siteUrl}/sitemap.xml`,
    ].join("\n");

    res.header("Content-Type", "text/plain");
    res.send(robots);
  });

  // 6. Hook for Search Console site verification file serving dynamically
  app.get(/\/google.*\.html$/, (req, res) => {
    const filename = path.basename(req.path);
    const configuredVerification = process.env.GOOGLE_SEARCH_CONSOLE_ID;
    
    if (configuredVerification && filename.includes(configuredVerification)) {
      res.send(`google-site-verification: ${filename}`);
    } else {
      res.status(404).send("Verification file not found");
    }
  });

  // 7. Dynamic SEO Tag Pre-rendering middleware for index.html
  const injectSEOTags = (html: string, originalUrl: string, host: string) => {
    const siteUrl = process.env.VITE_SITE_URL || `https://${host}`;
    const canonicalUrl = `${siteUrl}${originalUrl.split("?")[0]}`;
    
    // Meta mappings to cover all pages dynamically
    let seo = {
      title: "Nexvy - Premium Social Earning & Rewards Platform",
      description: "Join Nexvy to complete easy tasks, test your knowledge in AI-powered quizzes, play daily lucky wheel spins, and earn real-world rewards on a beautiful social dashboard.",
      keywords: "Nexvy, earn rewards, complete microtasks, social earning, daily quizzes, cash rewards, lucky spin dashboard",
      robots: "index, follow",
      ogType: "website",
      ogImage: `${siteUrl}/input_file_0.png`,
    };

    const pathPart = originalUrl.split("?")[0].toLowerCase();

    // Map specific paths to unique metadata
    if (pathPart === "/") {
      seo.title = "Nexvy - Turn Tasks & Fun Trait Play Into Real Rewards";
    } else if (pathPart === "/tasks") {
      seo.title = "Explore Earning Tasks | Nexvy App";
      seo.description = "Dozens of micro-tasks are active. Complete surveys, watch short videos, play games and get instant Nexvy coins directly into your digital wallet.";
    } else if (pathPart.startsWith("/task/")) {
      seo.title = "Complete Micro-Task for Rewards | Nexvy";
      seo.description = "View specific task guidelines, submit required verification credentials, and track your wallet coins payout online on Nexvy.";
    } else if (pathPart === "/quizzes") {
      seo.title = "Play Daily AI Quizzes & Trivia Games | Nexvy";
      seo.description = "Boost your knowledge and secure payouts by taking our daily trivia quizzes. Play mathematics, history, sci-tech, and custom general knowledge tests.";
    } else if (pathPart.startsWith("/quiz/")) {
      seo.title = "Active AI Trivia Contest | Nexvy";
      seo.description = "Complete this trivia round honestly. Get perfect scores and unlock massive multiplayer coin multiplier levels!";
    } else if (pathPart === "/shop-earn") {
      seo.title = "Shop & Earn Persistent Cashbacks | Nexvy Partners";
      seo.description = "Discover amazing discount codes and shop-to-earn cashback links from premium brands. Receive cashback directly in your Nexvy wallet.";
    } else if (pathPart === "/spinner") {
      seo.title = "Lucky Wheel Spin - Unlock Daily Multipliers | Nexvy";
      seo.description = "Feeling lucky? Give the wheel a turn today and win awesome coin packages and progressive multipliers absolutely free!";
    } else if (pathPart === "/daily-gift") {
      seo.title = "Daily Gift Login Rewards & Multi-Day Streak Boosts | Nexvy";
      seo.description = "Log in every 24 hours to secure consecutive check-in bonuses. Retain a daily streak multiplier to boost active challenge gains!";
    } else if (pathPart === "/leaderboard") {
      seo.title = "Nexvy Global Hall of Fame - Top Earners Leaderboard";
      seo.description = "Discover the top achievers, weekly microtask experts, and highest rewarding creators on the Nexvy platform.";
    } else if (pathPart === "/referral") {
      seo.title = "Invite Friends, Earn Lifetime Commissions | Nexvy Refer & Earn";
      seo.description = "Get instant welcome rewards for every active referred user. Enjoy lifetime referral percentage bonuses on their completed microtasks.";
    } else if (
      pathPart.startsWith("/admin") ||
      pathPart === "/profile" ||
      pathPart === "/withdraw"
    ) {
      // Add noindex to private portals and dashboards to protect indexing structure
      seo.title = "Security Portal | Nexvy";
      seo.robots = "noindex, nofollow";
    }

    // JSON-LD Structured Data Schema implementation
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Nexvy",
      "url": siteUrl,
      "logo": `${siteUrl}/input_file_0.png`,
      "description": "Premium social earning, gamified tasks, and rewards platform.",
      "sameAs": [
        "https://twitter.com/nexvy",
        "https://facebook.com/nexvy"
      ]
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Nexvy",
      "url": siteUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/tasks?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    const breadcrumbs: any[] = [{ "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl }];
    if (pathPart !== "/") {
      const segmentName = pathPart.split("/")[1].replace("-", " ");
      const capitalizedStr = segmentName.charAt(0).toUpperCase() + segmentName.slice(1);
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 2,
        "name": capitalizedStr,
        "item": `${siteUrl}${pathPart}`
      });
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs
    };

    const pageSchemas = [organizationSchema, websiteSchema, breadcrumbSchema];

    // FAQ schema for support pages
    if (pathPart === "/daily-gift" || pathPart === "/tasks") {
      pageSchemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How can I earn rewards on Nexvy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can earn coins by completing microtasks, solving AI quizzes, claiming daily gifts, and spinning the lucky wheel. Coins are redeemable for real rewards."
            }
          },
          {
            "@type": "Question",
            "name": "What are Daily Login Streaks?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "By checking in every single day on Nexvy, you build a continuous daily streak that boosts your active coin bonuses on consecutive login days."
            }
          }
        ]
      } as any);
    }

    const compiledSchemaMarkup = pageSchemas.map(s => 
      `<script type="application/ld+json">${JSON.stringify(s)}</script>`
    ).join("\n    ");

    // Replace or insert Title
    let modifiedHtml = html;
    if (modifiedHtml.includes("<title>")) {
      modifiedHtml = modifiedHtml.replace(/<title>.*?<\/title>/gi, `<title>${seo.title}</title>`);
    } else {
      modifiedHtml = modifiedHtml.replace("</head>", `  <title>${seo.title}</title>\n  </head>`);
    }

    // Dynamic Meta Replace/Injection Helper
    const replaceOrInsertMeta = (nameOrProperty: string, value: string, attrName = "name") => {
      const regex = new RegExp(`<meta\\s+${attrName}=["']${nameOrProperty}["']\\s+content=".*?"\\s*\\/?>|<meta\\s+content=".*?"\\s+${attrName}=["']${nameOrProperty}["']\\s*\\/?>`, "i");
      const tagContent = `<meta ${attrName}="${nameOrProperty}" content="${value.replace(/"/g, '&quot;')}" />`;
      if (regex.test(modifiedHtml)) {
        modifiedHtml = modifiedHtml.replace(regex, tagContent);
      } else {
        modifiedHtml = modifiedHtml.replace("</head>", `  ${tagContent}\n  </head>`);
      }
    };

    // Replace static values
    replaceOrInsertMeta("description", seo.description);
    replaceOrInsertMeta("keywords", seo.keywords);
    replaceOrInsertMeta("robots", seo.robots);
    replaceOrInsertMeta("author", "Nexvy Network");

    // Open Graph
    replaceOrInsertMeta("og:title", seo.title, "property");
    replaceOrInsertMeta("og:description", seo.description, "property");
    replaceOrInsertMeta("og:type", seo.ogType, "property");
    replaceOrInsertMeta("og:url", canonicalUrl, "property");
    replaceOrInsertMeta("og:image", seo.ogImage, "property");
    replaceOrInsertMeta("og:site_name", "Nexvy", "property");

    // Twitter Cards
    replaceOrInsertMeta("twitter:card", "summary_large_image");
    replaceOrInsertMeta("twitter:title", seo.title);
    replaceOrInsertMeta("twitter:description", seo.description);
    replaceOrInsertMeta("twitter:image", seo.ogImage);
    replaceOrInsertMeta("twitter:url", canonicalUrl);

    // Canonical link
    if (modifiedHtml.includes('rel="canonical"')) {
      modifiedHtml = modifiedHtml.replace(/<link\s+rel=["']canonical["']\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
    } else {
      modifiedHtml = modifiedHtml.replace("</head>", `  <link rel="canonical" href="${canonicalUrl}" />\n  </head>`);
    }

    // Search console meta validation verification injection
    const verificationId = process.env.GOOGLE_SEARCH_CONSOLE_ID;
    if (verificationId) {
      modifiedHtml = modifiedHtml.replace("</head>", `  <meta name="google-site-verification" content="${verificationId}" />\n  </head>`);
    }

    // Schema structure insertion
    modifiedHtml = modifiedHtml.replace("</head>", `  ${compiledSchemaMarkup}\n  </head>`);

    return modifiedHtml;
  };

  // 8. Setup Serve & Pre-rendering Mode
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    app.use(vite.middlewares);

    app.get("*all", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let html = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        html = await vite.transformIndexHtml(url, html);
        
        const optimizedHtml = injectSEOTags(html, url, req.headers.host || "localhost");
        res.status(200).set({ "Content-Type": "text/html" }).end(optimizedHtml);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production mode caching options (Cache static assets up to 1 year)
    const distPath = path.join(process.cwd(), "dist");
    
    app.use(express.static(distPath, {
      maxAge: "1d",
      setHeaders: (res, path) => {
        if (path.includes("/assets/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    }));

    app.get("*all", (req, res) => {
      try {
        const url = req.originalUrl;
        const html = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
        const optimizedHtml = injectSEOTags(html, url, req.headers.host || "www.nexvy.in");
        res.status(200).set({ "Content-Type": "text/html" }).end(optimizedHtml);
      } catch (e) {
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SEO-SERVER] Server running on http://localhost:${PORT}`);
  });
}

startServer();
