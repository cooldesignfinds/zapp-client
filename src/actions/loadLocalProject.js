import _ from 'lodash';
import axios from 'axios';
import yaml from 'js-yaml';
import { OrderedMap } from 'immutable';

import action from '../lib/action';
import loadImports from '../lib/loadImports';
import objectToOrderedMap from '../lib/objectToOrderedMap';
import orderedMapToObject from '../lib/orderedMapToObject';
import postMessage from '../lib/postMessage';

import deleteItem from './deleteItem';
import selectPaneTreeItem from './selectPaneTreeItem';
import updateItem from './updateItem';

async function loadLocalProject({
  data,
  dispatch
}) {
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

  const codeItems = {};
  const codeFiles = {};
  let codeMeta = OrderedMap();
  const zappData = result.data.project;

  items.forEach((item) => {
    codeItems[item.name] = item.type === 'dir' ? {} : '';
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
    cwd: data.cwd,
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

  return;

  // fs.watch(
  //   data.cwd,
  //   {
  //     encoding: 'buffer',
  //     recursive: true
  //   },
  //   (eventType, filename) => {
  //     if (/^\.zapp/.test(`${filename}`)) {
  //       return;
  //     }
  //
  //     const filePath = `${data.cwd}/${filename}`;
  //     const fileType = fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()
  //       ? 'directory'
  //       : 'file';
  //
  //     const fileEvent = (() => {
  //       if (eventType === 'rename') {
  //         if (!fs.existsSync(filePath)) {
  //           return 'delete';
  //         }
  //         return 'create';
  //       }
  //       return 'update';
  //     })();
  //
  //     const fileEvents = {
  //       create: () => {
  //         dispatch(
  //           updateItem({
  //             paneIndex: 1,
  //             paneType: 'code',
  //             itemPathParts: `${filename}`.split('/'),
  //             itemType: 'string',
  //             itemValue: fileType === 'directory' ? {} : ''
  //           })
  //         );
  //         // dispatch(
  //         //   selectPaneTreeItem({
  //         //     paneIndex: 1,
  //         //     itemPath: `/${filename}`,
  //         //     itemPathParts: `${filename}`.split('/')
  //         //   })
  //         // );
  //       },
  //       delete: () => {
  //         dispatch(
  //           deleteItem({
  //             paneType: 'code',
  //             itemPathParts: `${filename}`.split('/')
  //           })
  //         );
  //       },
  //       update: () => {
  //         dispatch(
  //           updateItem({
  //             paneIndex: 1,
  //             paneType: 'code',
  //             itemPathParts: `${filename}`.split('/'),
  //             itemType: 'string',
  //             itemValue: fileType === 'directory' ? {} : ''
  //           })
  //         );
  //         // dispatch(
  //         //   selectPaneTreeItem({
  //         //     paneIndex: 1,
  //         //     itemPath: `/${filename}`,
  //         //     itemPathParts: `${filename}`.split('/')
  //         //   })
  //         // );
  //       }
  //     };
  //
  //     fileEvents[fileEvent]();
  //   }
  // );
}

export default action(loadLocalProject);
