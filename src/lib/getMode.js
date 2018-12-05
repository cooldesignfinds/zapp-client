export default function getMode(file) {
  if (!file) {
    return 'text';
  }

  const ext = file.toLowerCase().split('.').slice(-1)[0];

  const mapping = {
    Dockerfile: 'dockerfile',
    '.babelrc': 'json',
    '.editorconfig': 'ini',
    '.npmrc': 'ini',
    as: 'actionscript',
    css: 'css',
    gitignore: 'gitignore',
    less: 'less',
    license: 'text',
    hbs: 'handlebars',
    htm: 'html',
    html: 'html',
    java: 'java',
    js: 'javascript',
    json: 'json',
    jsx: 'jsx',
    md: 'markdown',
    php: 'php',
    plist: 'xml',
    py: 'python',
    sass: 'sass',
    swift: 'swift',
    svg: 'svg',
    ts: 'typescript',
    yaml: 'yaml',
    yml: 'yaml'
  };

  return Object.keys(mapping).reduce((accum, curr) => {
    if (file === curr || ext === curr) {
      return mapping[curr];
    }
    return accum;
  }, 'text');
}
