export default function getRandomTutorialRecommendation(currentProjectName = '') {
  return [
    {
      color: '#4c5dfc',
      iconType: 'tour-white',
      name: 'Take a Tour',
      url: 'tutorials/tour'
    },
    {
      color: '#76cc71',
      iconType: 'hello-world-white',
      name: 'Hello World',
      url: 'tutorials/hello-world'
    },
    {
      color: '#e2de51',
      iconType: 'generator-white',
      name: 'Import Generators',
      url: 'tutorials/import-generators'
    },
    {
      color: '#f44a4a',
      iconType: 'schema-white',
      name: 'Add Schemas',
      url: 'tutorials/add-schemas'
    },
    {
      color: '#d14cfc',
      iconType: 'template-white',
      name: 'Create Templates',
      url: 'tutorials/create-templates'
    },
    {
      color: '#efa143',
      iconType: 'file-white',
      name: 'Configure Files',
      url: 'tutorials/configure-files'
    },
    {
      color: '#000',
      iconType: 'code-white',
      name: 'Browse Code',
      url: 'tutorials/browse-code'
    }
  ]
    .filter(item => item.name !== currentProjectName)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
}
