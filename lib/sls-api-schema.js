'use strict';

const { ApiResponse } = require('@janiscommerce/sls-api-response');
const { ApiSchema } = require('@janiscommerce/api-schema');

class SlsApiSchema {

	static async handler(event) {

		const pathParameters = event.path;

		const apiSchema = new ApiSchema();
		apiSchema.pathParameters = pathParameters;

		try {
			await apiSchema.validate();
		} catch(e) {

			return ApiResponse.send({
				statusCode: 404,
				body: {
					message: 'Schema not found'
				}
			});
		}

		const { code, ...response } = await apiSchema.process();

		return ApiResponse.send({ ...response, statusCode: code });
	}

}

module.exports = SlsApiSchema;
