import AddSchemasTutorial from '../tutorials/add-schemas';
import BrowseCodeTutorial from '../tutorials/browse-code';
import CreateTemplates from '../tutorials/create-templates';
import ConfigureFilesTutorial from '../tutorials/configure-files';
import HelloWorldTutorial from '../tutorials/hello-world';
import ImportGeneratorsTutorial from '../tutorials/import-generators';
import TourTutorial from '../tutorials/tour';

export default function getTutorial(name) {
  switch (name) {
    case 'add-schemas': {
      return AddSchemasTutorial;
    }
    case 'browse-code': {
      return BrowseCodeTutorial;
    }
    case 'configure-files': {
      return ConfigureFilesTutorial;
    }
    case 'create-templates': {
      return CreateTemplates;
    }
    case 'hello-world': {
      return HelloWorldTutorial;
    }
    case 'import-generators': {
      return ImportGeneratorsTutorial;
    }
    case 'tour': {
      return TourTutorial;
    }
    default: {
      return {};
    }
  }
}
