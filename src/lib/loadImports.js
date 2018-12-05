import Bluebird from 'bluebird';
import { GeneratorAPI } from '@zappjs/sdk';

import getItemPathParts from './getItemPathParts';
import orderedMapToObject from './orderedMapToObject';

export default async function loadImports(imports, ongoing = [], loadedImports = []) {
  const requests = Object.keys(imports).reduce((accum1, username) => {
    const userGenerators = imports[username];
    return accum1.concat(
      Object.keys(userGenerators).reduce((accum2, generatorName) => {
        const generatorVersion = typeof userGenerators[generatorName] === 'object' ? 'latest' : userGenerators[generatorName];
        const requestName = `${username}/${generatorName}/${generatorVersion}`;
        if (loadedImports.includes(requestName)) {
          return accum2;
        }
        loadedImports.push(`${username}/${generatorName}/${generatorVersion}`);
        return accum2.concat(
          GeneratorAPI.get({
            params: {
              name: generatorName,
              user: username,
              version: generatorVersion,
              configuration: 'default'
            }
          })
        );
      }, [])
    );
  }, []);

  const importsData = await Bluebird.all(requests)
    .map(res => res.generator)
    .map((generator) => {
      const filter = imports[generator.author.username][generator.name].filter;
      if (!Array.isArray(filter)) {
        return generator;
      }
      const filteredImportData = {
        ...generator,
        engines: {},
        files: {},
        imports: {},
        schemas: {},
        specs: {},
        templates: {}
      };
      filter.forEach((filterPath) => {
        const filterPathParts = getItemPathParts(filterPath);
        const filterPane = filterPathParts[0];
        filteredImportData[filterPane] = generator[filterPane];
      });
      return filteredImportData;
    });

  const subImports = importsData
    .filter(importData => Object.keys(importData.imports || {}).length > 0);

  if (subImports.length) {
    const subImportRequests = subImports
      .map(subImport => loadImports(subImport.imports, ongoing.concat(importsData), loadedImports));
    const subImportPromises = await Bluebird.all(subImportRequests);
    return subImportPromises.concat.apply([], subImportPromises);
  }

  return ongoing.concat(importsData);
}
