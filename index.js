import { version } from './package.json';
import './index.css';
export {
    showLoading,
    hideLoading
} from './src/util';
export {
    registerShikiHighlighter,
    setShikiPaths,
    registerMonaco,
    registerHightLight,
    registerPrettier,
    registerMarkMap,
    registerSwiper,
    registerQRCode,
    registerMermaid,
    registerXLSX,
    registerX_spreadsheet,
    registerFlowChart
} from './src/deps';
export * from './src/mdeditor';
export * from './src/toolicon';
export * from './theme/index';

console.log(`MdEditor Version: ${version}`);
