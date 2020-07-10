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
        <html lang="en" style="background-color: #f0f2f5;">
          <head>
            <title>Findrrr</title>
            <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
            <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
            <link rel="manifest" href="/manifest.json">
            <link href="https://fonts.googleapis.com/css2?family=Amatic+SC&family=Amiri&family=VT323&family=Roboto&family=Roboto+Mono&family=Sacramento&display=swap" rel="stylesheet">
          </head>
          <body>
            <div id="root">
    `;
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