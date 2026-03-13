import {
    registerMermaid,
    registerFlowChart,
    registerSwiper,
    registerXLSX,
    registerX_spreadsheet
} from '../index.js';

const smokeMarkdown = `
::: mermaid
graph TD
    A --> B
:::

::: flowchart
st=>start: Start
e=>end: End
st->e
:::

::: swiper
<div class="swiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">slide-1</div>
  </div>
  <div class="swiper-pagination"></div>
</div>
:::

excel:smoke://excel
`;

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function waitFor(checker, timeout = 6000, interval = 100) {
    const begin = Date.now();
    while (Date.now() - begin <= timeout) {
        if (checker()) {
            return true;
        }
        await wait(interval);
    }
    return false;
}

function installSmokeDeps() {
    registerMermaid({
        initialize() {
            return null;
        },
        run({ nodes }) {
            Array.from(nodes || []).forEach((node) => {
                node.dataset.processed = 'true';
            });
        }
    });
    registerFlowChart({
        parse() {
            return {
                drawSVG(dom) {
                    dom.dataset.smokeFlowchart = '1';
                },
                clean() {
                    return null;
                }
            };
        }
    });
    registerSwiper(class {
        constructor(dom) {
            this.dom = dom;
            dom.dataset.smokeSwiper = '1';
        }

        destroy() {
            return null;
        }
    });
    registerXLSX({
        read() {
            return {
                SheetNames: ['Sheet1'],
                Sheets: {
                    Sheet1: {
                        '!ref': 'A1'
                    }
                }
            };
        },
        utils: {
            decode_range() {
                return { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
            },
            sheet_to_json() {
                return [['ok']];
            },
            encode_cell() {
                return 'A1';
            },
            encode_range() {
                return 'A1';
            }
        }
    });
    registerX_spreadsheet(class {
        constructor(dom) {
            this.dom = dom;
        }

        loadData() {
            this.dom.dataset.smokeExcel = '1';
            return this;
        }

        change() {
            return this;
        }
    });
}

export async function runSmokeRenderTests(mdEditor) {
    if (!mdEditor || !mdEditor.previewDom) {
        return { success: false, reason: 'editor not ready' };
    }
    installSmokeDeps();
    const originFetch = window.fetch.bind(window);
    window.fetch = (input) => {
        const url = typeof input === 'string' ? input : input.url;
        if (url === 'smoke://excel') {
            const bytes = new Uint8Array([0, 1, 2, 3]).buffer;
            return Promise.resolve(new Response(bytes, { status: 200 }));
        }
        return originFetch(input);
    };
    let done = false;
    try {
        mdEditor.setValue(smokeMarkdown);
        done = await waitFor(() => {
            const dom = mdEditor.previewDom;
            const mermaidProcessed = dom.querySelector('.mermaid') && dom.querySelector('.mermaid').dataset.processed === 'true';
            const flowchartRendered = dom.querySelector('.flowchart') && dom.querySelector('.flowchart').dataset.smokeFlowchart === '1';
            const swiperRendered = dom.querySelector('.swiper') && dom.querySelector('.swiper').dataset.smokeSwiper === '1';
            const excelRendered = dom.querySelector('.excel-container') && dom.querySelector('.excel-container').dataset.smokeExcel === '1';
            return mermaidProcessed && flowchartRendered && swiperRendered && excelRendered;
        });
    } finally {
        window.fetch = originFetch;
    }
    if (!done) {
        return { success: false, reason: 'timeout' };
    }
    return { success: true };
}
