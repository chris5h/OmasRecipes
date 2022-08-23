// sw.js

const ASSETS = [
    "/images/details_close.png",
    "/images/details_open.png",
    "/images/sort_asc.png",
    "/images/sort_asc_disabled.png",
    "/images/sort_both.png",
    "/images/sort_desc.png",
    "/images/sort_desc_disabled.png",
    "/images/icon.png",
    "/images/apple-touch-icon.png",
    "/resources/bootstrap.bundle.min.js",
    "/resources/bootstrap.min.css",
    "/resources/jquery-3.6.0.min.js",
    "/resources/jquery.dataTables.min.css",
    "/resources/jquery.dataTables.min.js",
    "/resources/recipes.json",
    "resources/html2canvas.min.js",
    "/index.html",
    "/manifest.webmanifest",
    "/sw.js",
    "/"
];

let cache_name = "RecipeCache"; // The string used to identify our cache
self.addEventListener("install", event => {
    event.waitUntil(
        caches
            .open(cache_name)
            .then(cache => {
                return cache.addAll(ASSETS);
            })
            .catch(err => console.log(err))
    );
});

self.addEventListener("fetch", event => {
    console.log('yolo magolo');
    event.respondWith(
        fetch(event.request).catch(err =>
            self.Cache.open(cache_name).then(cache => cache.match("/index.html"))
        )
    );
});