import { fetchScheduler } from './fetchScheduler';

const INCLUDE_FLAG = 'include:';
export function checkInclude(text, callback) {
    if (text.indexOf(INCLUDE_FLAG) === -1) {
        callback(text, false);
        return;
    }
    const segments = text.split(INCLUDE_FLAG);
    const includeEntries = [];
    for (let i = 1, len = segments.length; i < len; i++) {
        const line = segments[i];
        let url = '';
        for (let j = 0, len1 = line.length; j < len1; j++) {
            const char = line[j];
            if (char === ' ' || char === '\n' || char === '\r') {
                includeEntries.push({
                    start: 0,
                    end: j,
                    url,
                    line
                });
                break;
            }
            url += char;
        }
    }
    let finished = 0;
    const finalize = () => {
        finished++;
        if (finished === includeEntries.length) {
            includeEntries.forEach(singleText => {
                const { text, end, url } = singleText;
                if (!text) {
                    singleText.line = `<p style="color:red">fetch snip file error,url:${url}</p>` + singleText.line.substring(end, Infinity);
                } else {
                    singleText.line = `${text}\n` + singleText.line.substring(end, Infinity);
                }
            });
            let value = segments[0];
            includeEntries.forEach(singleText => {
                value += singleText.line;
            });
            callback(value, true);
        }
    };
    includeEntries.forEach(singleText => {
        const promise = fetchScheduler.createFetch(singleText.url, {
            // ...
        });
        promise.then(res => res.text()).then(text => {
            singleText.text = text;
            finalize();
        }).catch(err => {
            console.error(err);
            finalize();
        });
    });
    // callback(text);
}
