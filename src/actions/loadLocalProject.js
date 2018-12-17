import _ from 'lodash';
import axios from 'axios';
import { OrderedMap } from 'immutable';

import action from '../lib/action';
import getItemPathParts from '../lib/getItemPathParts';
import objectToOrderedMap from '../lib/objectToOrderedMap';

async function loadLocalProject({
  data,
  dispatch
}) {
  try {
    dispatch({
      type: 'LOAD_PROJECT_REQ',
      cwd: data.cwd
    });

    document.title = data.cwd;

    const result = await axios({
      method: 'post',
      url: 'http://localhost:12345/loadProject',
      data: {
        cwd: data.cwd
      }
    });

    const importsResult = await axios({
      method: 'post',
      url: 'http://localhost:12345/loadImports',
      data: {
        cwd: data.cwd
      }
    });

    const { items } = (
      await axios({
        method: 'post',
        url: 'http://localhost:12345/listFiles',
        data: {
          cwd: data.cwd
        }
      })
    ).data;

    let codeItems = {};
    const codeFiles = {};
    let codeMeta = OrderedMap();
    const zappData = result.data.project;

    items.forEach((item) => {
      codeItems = _.set(codeItems, getItemPathParts(item.name), item.type === 'dir' ? {} : '');
      if (item.type === 'dir') {
        codeMeta = codeMeta.set(item.name, objectToOrderedMap({
          isEmpty: item.isEmpty
        }));
      }
    });

    const meta = objectToOrderedMap(zappData.meta);

    const code = objectToOrderedMap(codeItems, codeMeta, [], true);
    const configs = objectToOrderedMap(zappData.configs, meta.get('configs'));
    const engines = objectToOrderedMap(zappData.engines, meta.get('engines'));
    const files = objectToOrderedMap(zappData.files, meta.get('files'));
    const generators = objectToOrderedMap(zappData.generators, meta.get('generators'));
    const imports = objectToOrderedMap(zappData.imports, meta.get('imports'));
    const schemas = objectToOrderedMap(zappData.schemas, meta.get('schemas'));
    const specs = objectToOrderedMap(zappData.specs, meta.get('specs'));
    const templates = objectToOrderedMap(zappData.templates, meta.get('templates'));

    const importsDataArray = importsResult.data.imports;

    const importsData = objectToOrderedMap(importsDataArray);

    dispatch({
      type: 'LOAD_PROJECT_RES',
      id: 'local',
      color: '',
      icon: '',
      isFavorite: false,
      isLocal: true,
      name: data.cwd
        .split('/')
        .slice(-1)[0],
      version: 'latest',
      code,
      codeFiles,
      configs,
      configuration: 'default',
      configurations: [],
      engines,
      files,
      meta,
      author: '',
      generators,
      imports,
      importsData,
      schemas,
      specs,
      templates,
      versions: []
    });
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    dispatch({
      type: 'LOAD_PROJECT_ERR',
      error: `${errorMessage}: ${data.cwd}`,
      skipLogging: true
    });
  }
}

export default action(loadLocalProject);
