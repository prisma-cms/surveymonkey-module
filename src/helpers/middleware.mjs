
import express from 'express';
import bodyParser from 'body-parser';
import Debug from "debug";
import {
  request,
} from '../';
import { capitalizeFirstLetter } from './';

const debug = Debug('surveymonkey_module:router');


export const createResponse = async (args, ctx) => {

  const {
    db,
    custom_variable_user_id_name,
  } = ctx;

  const {
    object_type,
    object_id: externalKey,
    resources,
  } = args;

  if (object_type !== 'response') {
    throw new Error('object_type is not response');
  }

  if (!externalKey) {
    throw new Error('object_id is empty');
  }


  const {
    respondent_id,
    survey_id,
    user_id: surveymonkey_user_id,
    collector_id,

    // Can be "0"
    recipient_id,
  } = resources || {};


  if (!survey_id) {
    throw new Error('survey_id is empty');
  }


  /**
   * Получаем объект респонса
   */

  const survey = await request(`/surveys/${survey_id}/responses/${externalKey}`);

  debug('createResponse survey', JSON.stringify(survey, true, 2));

  const {
    // recipient_id,
    collection_mode,
    response_status,
    custom_value,
    ip_address,
    logic_path,
    metadata,
    page_path,
    // collector_id,
    custom_variables,
    edit_url,
    analyze_url,
    total_time,
    date_modified,
    date_created,
    href,

    first_name,
    last_name,
    email_address,
  } = survey;

  let Survey;
  let Collector;
  let SurveymonkeyUser;
  let User;
  let points;

  /**
   * Collect editional data
   */

  if (collector_id) {

    const collector = await db.query.surveymonkeyCollector({
      where: {
        externalKey: collector_id,
      },
    })
      .catch(console.error);

    if (collector) {
      Collector = {
        connect: {
          id: collector.id,
        },
      }
    }
  }

  if (survey_id) {

    const survey = await db.query.surveymonkeySurvey({
      where: {
        externalKey: survey_id,
      },
    })
      .catch(console.error);

    if (survey) {

      const {
        points: surveyPoints,
      } = survey;

      /**
       * Фиксируем начисляемые за прохождение очки
       */
      if (surveyPoints) {
        points = surveyPoints;
      }

      Survey = {
        connect: {
          id: survey.id,
        },
      }
    }
  }

  if (surveymonkey_user_id) {

    const surveymonkeyUser = await db.query.surveymonkeyUser({
      where: {
        externalKey: surveymonkey_user_id,
      },
    })
      .catch(console.error);

    if (surveymonkeyUser) {
      SurveymonkeyUser = {
        connect: {
          id: surveymonkeyUser.id,
        },
      }
    }
    else {
      SurveymonkeyUser = {
        create: {
          externalKey: surveymonkey_user_id,
          first_name: first_name || null,
          last_name: last_name || null,
          email_address: email_address || null,
        },
      }
    }

  }

  if (custom_variable_user_id_name) {

    const {
      [custom_variable_user_id_name]: user_id,
    } = custom_variables || {};

    if (user_id) {

      const user = await db.query.user({
        where: {
          id: user_id,
        },
      })
        .catch(console.error);

      if (user) {
        User = {
          connect: {
            id: user.id,
          },
        }
      }

    }

  }


  const data = {
    externalKey: externalKey || null,
    recipient_id: recipient_id && recipient_id !== "0" ? recipient_id : null,
    collection_mode: collection_mode ? capitalizeFirstLetter(collection_mode) : null,
    response_status: response_status ? capitalizeFirstLetter(response_status) : null,
    custom_value,
    ip_address,
    logic_path,
    metadata,
    page_path: page_path && Array.isArray(page_path) && page_path.length ? {
      set: page_path,
    } : null,
    collector_id,
    custom_variables,
    edit_url,
    analyze_url,
    total_time,
    date_modified,
    date_created,
    href,
    respondent_id,
    points,
    Survey,
    Collector,
    SurveymonkeyUser,
    User,
  };

  debug('createResponse create data', JSON.stringify(data, true, 2));

  // return;

  return db.mutation.createSurveymonkeyResponse({
    data,
  });
}


const createRouter = (options) => {

  const {
    server,
    webhookResponseCompleted = '/response_completed',
    custom_variable_user_id_name = 'user_id',
  } = options || {};

  if (!server) {
    throw new Error('server is required');
  }

  const {
    db,
  } = server;

  if (!db) {
    throw new Error('db is required');
  }

  const router = new express.Router();

  router.use('/', bodyParser.json({
    type: 'application/vnd.surveymonkey.response.v1+json',
  }));


  /**
   * Этот хук выполняется, когда пользователь полностью прошел опрос.
   */
  if (webhookResponseCompleted) {

    router.use(webhookResponseCompleted, async (req, res) => {

      // console.log('webhookResponseCompleted req', req);

      debug('webhookResponseCompleted headers', req.headers);
      debug('webhookResponseCompleted body', req.body);

      const {
        body,
      } = req;

      const {
        event_type,
      } = body;

      let result;

      switch (event_type) {

        case 'response_completed':

          result = await createResponse(body, {
            db,
            custom_variable_user_id_name,
          })
            .catch(error => {

              return error;
            });

          break;

        default: ;
      }

      debug('webhookResponseCompleted result', result);

      if (result instanceof Error) {
        res.status(502).end(result.message);

        throw result;
      }

      // else
      return res.status(200).end('OK');
    });

  }

  return router;
};

export default createRouter;
