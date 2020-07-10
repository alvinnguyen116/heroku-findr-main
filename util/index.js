const MAX_LIMIT = 25;

/**
 * @param obj
 * @param limit
 * @desc Cast the limit and offset as well as
 * setting a max limit.
 */
export function safeCastOptions({limit, offset}) {
    limit = limit || MAX_LIMIT;
    if (typeof limit === 'string') {
        limit = parseInt(limit, 10);
    }
    limit = Math.min(limit,MAX_LIMIT);

    let skip = offset || 0;
    if (typeof skip === 'string') {
        skip = parseInt(skip, 10);
    }
    return {limit,skip}
}

export function sendFullPage({res, componentStream}) {
    // write start
    const htmlStart = `
        <!DOCTYPE html>
            <html>
              <head>
                <title>Findrrr</title>
              </head>
              <body>
                <div id="root">`;
    res.write(htmlStart);

    // write the app component
    componentStream.pipe(res, { end: false });

    // write end
    const htmlEnd = `</div>
                <script src="/clientBundle.js"></script>
            </body>
        </html>`;
    componentStream.on("end", () => {
        res.write(htmlEnd);
        res.end();
    });
}