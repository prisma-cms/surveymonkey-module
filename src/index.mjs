
import Debug from "debug";

import Module from './modules'

import SurveymonkeySurveyModule, {
  SurveymonkeySurveyProcessor,
} from './modules/SurveymonkeySurvey'

import SurveymonkeyImportModule, {
  SurveymonkeyImportProcessor,
} from './modules/SurveymonkeyImport'

import SurveymonkeyCollectorModule, {
  SurveymonkeyCollectorProcessor,
} from './modules/SurveymonkeyCollector'

const debug = Debug('surveymonkey_module:core');

export const modules = [
  SurveymonkeySurveyModule,
  SurveymonkeyImportModule,
  SurveymonkeyCollectorModule,
]

export {

  SurveymonkeySurveyModule,
  SurveymonkeySurveyProcessor,

  SurveymonkeyImportModule,
  SurveymonkeyImportProcessor,

  SurveymonkeyCollectorModule,
  SurveymonkeyCollectorProcessor,

}


export const request = async (path, options) => {

  const {
    method = 'GET',
    // data,
  } = options || {};

  const {

    SURVEYMONKEY_ENDPOINT: endpoint = 'https://api.surveymonkey.com/v3',
    SURVEYMONKEY_TOKEN: token,
  } = process.env;


  if (!endpoint) {
    throw new Error('SURVEYMONKEY_ENDPOINT environment is empty');
  }

  debug('endpoint', endpoint);
  debug('token', token);

  if (!token) {

    throw new Error('SURVEYMONKEY_TOKEN environment is empty');
  }

  const url = `${endpoint}${path}`;

  const result = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })
    .then(response => {

      return response.json();
    });

  const {
    error,
  } = result || {};

  if (error) {

    const {
      name,
      message,
    } = error;

    debug('error', error);
    throw new Error(message || name);

  }

  return result;
}


export default Module
