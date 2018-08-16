const argv = require('yargs')
    // Watch option
    .describe('w', 'Watch files')
    .alias('w', 'watch')
    .boolean('w')
    // Prod option
    .describe('p', 'Create production codebase')
    .alias('p', 'prod')
    .boolean('p')
    // Source map option
    .describe('s', 'Generate source map')
    .alias('s', 'source-map')
    .boolean('s')
    // components option
    .describe('c', 'Generate specific components')
    .alias('c', 'comp')
    // vendors option
    .describe('v', 'Generate vendor files')
    .alias('v', 'vendor')
    .boolean('v')
    // Registry based builds option
    .describe('r', 'Build and push versions to registry DB')
    .alias('r', 'registry')
    .boolean('r')
    // Help Option
    .help('h')
    .alias('h', 'help')
    .argv;

function setCliOptions() {
    global.FOO_WATCH = argv.w || false;
    global.FOO_PROD = argv.p || false;
    global.FOO_SOURCEMAP = argv.s || false;
    global.FOO_COMPONENTS = argv.c || false;
    global.FOO_VENDORS = argv.v || false;
    global.FOO_REGISTRY = argv.r || false;
}
setCliOptions();
